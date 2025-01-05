module Mutations
  module Cart
    class AddToCartMutation < BaseMutation
      description "Add a product to the shopping cart"

      argument :product_id, ID, required: true
      argument :quantity, Integer, required: true
      argument :selected_options, GraphQL::Types::JSON, required: false

      field :cart_item, Types::CartItemType, null: true
      field :errors, [String], null: false

      def resolve(product_id:, quantity:, selected_options: {})
        session_id = context[:session_id]
        return { errors: ["Session ID not found"] } if session_id.blank?

        cart = ::Cart.find_or_create_by(session_id: session_id, checked_out_at: nil)
        product = Product.find_by(id: product_id).dup

        return { errors: ["Product not found"] } if product.nil?

        # Ensure the selected options are valid and in stock
        selected_options.each do |option|
          option = PartOption.find_by(id: option["optionId"].to_i)
          if option.nil?
            return { errors: ["Invalid or out-of-stock option: #{option_id}"] }
          end
        end

        product.save
        product.reload

        # Find or create the cart item
        cart_item = cart.cart_items.find_or_initialize_by(
          product_id: product_id,
          selected_options: selected_options.to_json
        )

        if cart_item.save
          { cart_item: cart_item, errors: [] }
        else
          { errors: cart_item.errors.full_messages }
        end
      end


    end
  end
end