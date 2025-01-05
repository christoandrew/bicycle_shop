# frozen_string_literal: true

source "https://rubygems.org"

gem "sinatra"
gem "sinatra-activerecord"
gem "sqlite3"
gem "rack-cors" # For enabling cross-origin requests
gem 'rake'
gem 'graphql'
gem 'puma'
gem 'sinatra-contrib'
gem 'haml'
gem 'zeitwerk'
gem 'nanoid'

group :development, :test do
  gem 'rspec'
  gem 'rspec-sinatra'
  gem 'rack-test'
  gem 'database_cleaner-active_record'
  gem 'factory_bot'
  gem "rerun", require: false
  gem 'pry'
end

group :test do
  gem 'shoulda-matchers', '~> 5.0'
end