module Inputs
  class UpdatePartCategoryInput < CreatePartCategoryInput
    argument :id, ID, required: true
  end
end