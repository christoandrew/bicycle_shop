require './spec/spec_helper'

FactoryBot.define do
  factory :full_suspension_frame_option, class: PartOption do
    name { "Full-suspension" }
    part_category { create :bicycle_frame_category }
    price { "9.99" }
    in_stock { true }
  end

  factory :carbon_frame_option, class: PartOption do
    name { "Carbon" }
    part_category { create :bicycle_frame_category }
    price { "9.99" }
    in_stock { true }
  end

  factory :tubeless_tire_option, class: PartOption do
    name { "Tubeless" }
    part_category { create :bicycle_tire_category }
    price { "9.99" }
    in_stock { true }
  end

  factory :clincher_tire_option, class: PartOption do
    name { "Clincher" }
    part_category { create :bicycle_tire_category }
    price { "9.99" }
    in_stock { true }
  end

  factory :matte_finish_option, class: PartOption do
    name { "Matte Finish" }
    part_category { create :bicycle_finish_category }
    price { "9.99" }
    in_stock { true }
  end

  factory :gloss_finish_option, class: PartOption do
    name { "Gloss Finish" }
    part_category { create :bicycle_finish_category }
    price { "9.99" }
    in_stock { true }
  end

  factory :aero_wheel_option, class: PartOption do
    name { "Aero" }
    part_category { create :bicycle_wheel_category }
    price { "9.99" }
    in_stock { true }
  end

  factory :light_wheel_option, class: PartOption do
    name { "Light" }
    part_category { create :bicycle_wheel_category }
    price { "9.99" }
    in_stock { true }
  end

end