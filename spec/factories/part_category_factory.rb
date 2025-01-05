FactoryBot.define do
  factory :part_category do
    sequence(:name) { |n| "Category #{n}" }
    required { true }
    active { true }
    sequence(:position) { |n| n }
    association :product_type

    factory :frame_category do
      name { "Frame Type" }
      position { 1 }
    end

    factory :finish_category do
      name { "Frame Finish" }
      position { 2 }
    end

    factory :wheel_category do
      name { "Wheels" }
      position { 3 }
    end
  end
end