FactoryBot.define do
  factory :part_option do
    sequence(:name) { |n| "Option #{n}" }
    price { 49.99 }
    in_stock { true }
    stock_quantity { 100 }
    sequence(:position) { |n| n }
    association :part_category

    factory :full_suspension_option do
      name { "Full Suspension" }
      price { 130.00 }
    end

    factory :matte_finish_option do
      name { "Matte Finish" }
      price { 35.00 }
    end

    factory :road_wheels_option do
      name { "Road Wheels" }
      price { 80.00 }
    end
  end
end