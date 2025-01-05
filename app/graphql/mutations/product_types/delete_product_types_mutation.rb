module Mutations
  module ProductTypes
    class DeleteProductTypesMutation < BaseMutation
      argument :id, ID, required: true

      field :product_type, Types::ProductTypeDefinitionType, null: true
      field :errors, [String], null: false

      def resolve(id:)
        product_type = ProductType.find(id)

        if product_type.destroy
          {
            product_type: product_type,
            errors: [],
          }
        else
          {
            product_type: nil,
            errors: product_type.errors.full_messages,
          }
        end
      end
    end
  end
end