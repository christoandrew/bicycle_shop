FactoryBot.define do
  factory :product_type do
    sequence(:name) { |n| "Product Type #{n}" }
    sequence(:code) { |n| "type_#{n}" }
    description { "A generic product type" }
    active { true }

    factory :bicycle_type do
      name { "Bicycle" }
      code { "bicycle" }
      description { "Customizable bicycle type" }
    end

    factory :ski_type do
      name { "Ski" }
      code { "ski" }
      description { "Customizable ski type" }
    end
  end
end
