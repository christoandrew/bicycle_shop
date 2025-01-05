# frozen_string_literal: true

FactoryBot.define do
  factory :matte_finish_on_full_suspension_frame_rule, class: PriceRule do
    product { create :bicycle_product }
    price { "69.99" }
    description { "Matt finish on full suspension frame" }
    active { true }
  end
end