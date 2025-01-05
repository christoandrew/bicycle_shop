module Inputs
  class CreatePriceRuleInput < BaseInput
    argument :description, String, required: true
    argument :active, Boolean, required: true
    argument :product_type_id, ID, required: true
    argument :price, Float, required: true
  end
end