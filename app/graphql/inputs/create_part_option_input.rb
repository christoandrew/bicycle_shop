module Inputs
  class CreatePartOptionInput < BaseInput
    argument :name, String, required: true
    argument :position, Integer, required: false
    argument :part_category_id, ID, required: true
    argument :price, Float, required: false
    argument :in_stock, Boolean, required: false
    argument :stock_quantity, Integer, required: false
  end
end