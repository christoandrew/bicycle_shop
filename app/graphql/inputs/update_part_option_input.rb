module Inputs
  class UpdatePartOptionInput < CreatePartOptionInput
    argument :id, ID, required: true
  end
end