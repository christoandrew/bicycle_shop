module Inputs
  class UpdateProductTypeDefinitionInput < Inputs::BaseInput
    argument :id, ID, required: true
    argument :name, String, required: false
    argument :description, String, required: false
    argument :active, Boolean, required: false
    argument :code, String, required: false
  end
end