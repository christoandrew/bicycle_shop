require 'bundler/setup'
Bundler.require(:default)

require 'sinatra'
require "sinatra/json"
require 'haml'
require 'sinatra/activerecord'
require 'active_record'
require 'sqlite3'
require 'json'
require 'rack/cors'
require 'graphql'
require 'zeitwerk'

loader = Zeitwerk::Loader.new
loader.push_dir(File.expand_path("../app/models", __dir__))
loader.push_dir(File.expand_path("../app/controllers", __dir__))
loader.push_dir(File.expand_path("../app/graphql", __dir__))

loader.inflector.inflect "graphql" => "GraphQL"
loader.enable_reloading
loader.setup

set :database_file, 'database.yml'

Thread.current[:user] = OpenStruct.new(
  id: 1,
  email: 'user@dev.co',
  username: 'user',
)

helpers do
  def logger
    request.logger
  end

  def current_user
    Thread[:user]
  end
end