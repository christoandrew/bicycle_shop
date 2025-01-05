FactoryBot.define do
  factory :price_rule do
    sequence(:description) { |n| "Price Rule #{n}" }
    price { 49.99 }
    active { true }
    association :product_type
  end
end