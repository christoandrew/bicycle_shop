# frozen_string_literal: true

FactoryBot.define do
  factory :product_configuration, class: ProductConfiguration do
    name { 'My Product Configuration' }
    product
    total_price { 199.9 }
  end
end
