require "sinatra/activerecord"
require "securerandom"

class GraqhQLController < Sinatra::Base
  register Sinatra::ActiveRecordExtension

  helpers do
    def logger
      request.logger
    end

    def current_user
      Thread[:user]
    end
  end

  enable :sessions

  set :session_secret, '638af413ebdfdc3a1e4aab7263cbb732104fc75c098e9a120cc03e287ea745c177c128bc359c61b15a693264986fc60e6e41a0bc73ef308865be78d7901a02e3'
  set :sessions, httponly: true, secure: false, expire_after: 2592000
  set :views, File.join(root, '../views')
  set :logger, Logger.new(STDOUT)
  set :public_folder, File.join(root, '../../public')

  before do
    if request.content_type == 'application/json'
      request.body.rewind
      @request_payload = JSON.parse(request.body.read, symbolize_names: true) rescue {}
    end

    logger.info "Current Session ID: #{session[:id]}"
    session[:id] ||= SecureRandom.uuid
    logger.info "Session ID after assignment: #{session[:id]}"
  end

  post '/graphql' do
    content_type :json

    query = @request_payload[:query]
    variables = @request_payload[:variables] || {}
    operation_name = @request_payload[:operation_name]

    if query.nil? || query.strip.empty?
      status 400
      json({ errors: [{ message: "No query string was present" }] }.to_json)
    end

    session_id ||= request.env['HTTP_X_SESSION_ID'] || session[:id]

    context = {
      session_id: session_id
    }

    response.headers['X-Session-Id'] = session_id

    result = Schema.execute(
      query,
      variables: variables,
      context: context,
      operation_name: operation_name
    )
    json result
  rescue StandardError => e
    handle_error_in_development(e)
  end

  if development?
    get '/graphiql' do
      haml :graphiql
    end
  end

  private

  def prepare_variables(variables_param)
    case variables_param
    when String
      variables_param.present? ? JSON.parse(variables_param) || {} : {}
    when Hash
      variables_param
    when nil
      {}
    else
      raise ArgumentError, "Unexpected parameter: #{variables_param}"
    end
  end

  def handle_error_in_development(error)
    logger.error error.message
    logger.error error.backtrace.join("\n")

    json({
      error: { message: error.message, backtrace: error.backtrace },
      data: {}
    }, status: 500)
  end
end