module Mutations
  module ProductTypes
    class CreateProductTypesMutation < BaseMutation
      argument :input, Inputs::CreateProductTypeDefinitionInput, required: true

      field :product_type, Types::ProductTypeDefinitionType, null: false
      field :errors, [String], null: false

      def resolve(input:)
        product_type = ProductType.new(input.to_h)

        if product_type.save
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