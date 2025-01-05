module Inputs
  class CreatePartCategoryInput < BaseInput
    argument :name, String, required: true
    argument :position, Integer, required: false
    argument :product_type_id, ID, required: true
    argument :required, Boolean, required: true
    argument :active, Boolean, required: true
  end
end