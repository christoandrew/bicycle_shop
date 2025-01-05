module Inputs
    class CreateProductDefinitionInput < BaseInput
      argument :name, String, required: false
      argument :description, String, required: true
      argument :base_price, Float, required: true
      argument :product_type_id, ID, required: true
      argument :active, Boolean, required: false
      argument :preconfigured, Boolean, required: false
      argument :product_selections, [Inputs::ProductSelectionInput], required: false
    end
end