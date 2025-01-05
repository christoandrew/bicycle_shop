module Inputs
  class CreateProductTypeDefinitionInput < Inputs::BaseInput
    argument :name, String, required: true
    argument :description, String, required: false
    argument :active, Boolean, required: false
    argument :code, String, required: false
  end
end