# frozen_string_literal: true

FactoryBot.define do
  factory :configuration_selection, class: ProductConfigurationSelection do
    product_configuration { create :product_configuration }
    part_category { create :part_category }
    part_option { create :part_option }

    factory :matte_finish_selection, class: ProductConfigurationSelection do
      product_configuration { create :product_configuration }
      part_category { create :matte_finish_option.part_category }
      part_option { create :matte_finish_option }
    end
  end
end
