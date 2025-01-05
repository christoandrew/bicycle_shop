module Mutations
  module Products
    class DeleteProductsMutation < BaseMutation
      argument :id, ID, required: true

      field :product, Types::ProductDefinitionType, null: false
      field :errors, [String], null: false

      def resolve(id:)
        product = Product.find(id)
        product.destroy

        if product.destroyed?
          {
            product: product,
            errors: [],
          }
        else
          {
            product: nil,
            errors: product.errors.full_messages,
          }
        end
      end
    end
  end
end