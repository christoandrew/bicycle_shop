module Mutations
  module Cart
    class CheckoutMutation < BaseMutation
      description "Checkout the shopping cart"

      argument :session_id, String, required: true

      field :errors, [String], null: false

      def resolve(session_id:)
        cart = ::Cart.where(session_id: session_id, checked_out_at: nil).first
        return { errors: ["Cart not found"] } if cart.nil?

        cart.update(checked_out_at: Time.now)
        { errors: [] }
      end
    end
  end
end