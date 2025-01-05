require './config/environment'
require_relative './app/controllers/graphql_controller'
require 'sinatra/activerecord'
require 'sinatra/activerecord/rake'

use Rack::Logger
use Rack::Cors do
  allow do
    origins '*'
    resource '*', headers: :any, methods: %i[get post put delete options]
  end
end

run GraqhQLController