module Inputs
  class ProductSelectionInput < BaseInput
    argument :product_id, ID, required: true
    argument :part_option_id, ID, required: true
  end
end