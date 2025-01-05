class Cart < ActiveRecord::Base
  has_many :cart_items, dependent: :destroy

  def calculate_total
    cart_items.to_a.sum(&:total_price)
  end
end