module Inputs
  class UpdateProductDefinitionInput < CreateProductDefinitionInput
    argument :id, ID, required: true
  end
end