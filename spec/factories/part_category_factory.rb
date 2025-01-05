require './spec/spec_helper'

FactoryBot.define do
  factory :bicycle_frame_category, class: PartCategory do
    name { "Frame" }
    required { true }
    product { create :bicycle_product }
  end

  factory :bicycle_wheel_category, class: PartCategory do
    name { "Wheel" }
    required { true }
    product { create :bicycle_product }
  end

  factory :bicycle_handlebar_category, class: PartCategory do
    name { "Handlebar" }
    required { true }
    product { create :bicycle_product }
  end

  factory :bicycle_seat_category, class: PartCategory do
    name { "Seat" }
    required { true }
    product { create :bicycle_product }
  end

  factory :bicycle_pedal_category, class: PartCategory do
    name { "Pedal" }
    required { true }
    product { create :bicycle_product }
  end

  factory :bicycle_gear_category, class: PartCategory do
    name { "Gear" }
    required { true }
    product { create :bicycle_product }
  end

  factory :bicycle_brake_category, class: PartCategory do
    name { "Brake" }
    required { true }
    product { create :bicycle_product }
  end

  factory :bicycle_tire_category, class: PartCategory do
    name { "Tire" }
    required { true }
    product { create :bicycle_product }
  end

  factory :bicycle_finish_category, class: PartCategory do
    name { "Finish" }
    required { true }
    product { create :bicycle_product }
  end
end