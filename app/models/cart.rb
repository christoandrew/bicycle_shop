class Cart < ActiveRecord::Base
  has_many :cart_items, dependent: :destroy

  validates_presence_of :session_id
  def calculate_total
    cart_items.to_a.sum(&:total_price)
  end

end