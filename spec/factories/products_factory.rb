FactoryBot.define do
  factory :product do
    sequence(:name) { |n| "Product #{n}" }
    description { "A generic product" }
    base_price { 199.99 }
    active { true }
    in_stock { true }
    preconfigured { false }
    association :product_type

    factory :bicycle_product do
      name { "Mountain Bike" }
      description { "Base Mountain Bicycle" }
      base_price { 199.99 }
      association :product_type, factory: :bicycle_type
      preconfigured { true }
    end
  end
end