module Types
  class OrderType < GraphQL::Schema::Object
    field :id, ID, null: true
    field :session_id, String, null: true
    field :cart_items, [CartItemType], null: true
    field :total_price, Float, null: true

    def cart_items
      object.cart_items
    end

    def total_price
      object.cart_items.sum(&:total_price)
    end
  end
end