require './spec/spec_helper'

FactoryBot.define do
  factory :product do
    name { "Bicycle" }
    description { "Base Mountain Bicycle" }
    base_price { "199.99" }
    product_type { "Bicycle" }

    factory :bicycle_product do
      name { "Bicycle" }
      description { "Base Mountain Bicycle" }
      base_price { "199.99" }
      product_type { "Bicycle" }
      preconfigured { true }
    end
  end
end