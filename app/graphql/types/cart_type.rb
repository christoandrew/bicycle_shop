# frozen_string_literal: true

module Types
  class CartType < GraphQL::Schema::Object
    field :id, ID, null: true
    field :session_id, String, null: true
    field :cart_items, [CartItemType], null: true
    field :total_price, Float, null: true

    def cart_items
      cart = Cart.find(object[:cart][:id])
      cart.cart_items
    end

    def total_price
      cart = Cart.where(session_id: object[:session_id], checked_out_at: nil).first
      cart.cart_items.sum(&:total_price)
    end
  end
end
