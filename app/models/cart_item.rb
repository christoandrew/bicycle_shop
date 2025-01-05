# frozen_string_literal: true
class CartItem < ActiveRecord::Base
  belongs_to :cart
  belongs_to :product

  validates_presence_of :cart, :product, :quantity

  def total_price
    options = JSON.parse(selected_options)
    selected_options = options.map{|option| option["optionId"].to_i }
    product.calculate_price(selected_options)
  end
end
