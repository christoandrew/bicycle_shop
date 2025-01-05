module Mutations
  module ProductTypes
    class UpdateProductTypesMutation < BaseMutation
      argument :input, Inputs::UpdateProductTypeDefinitionInput, required: true

      field :product_type, Types::ProductTypeDefinitionType, null: true
      field :errors, [String], null: false

      def resolve(input:)
        product_type = ProductType.find(input[:id])
        params = input.to_h
        if params[:active] == false
          params.delete(:code)
        end

        if product_type.update(params)
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