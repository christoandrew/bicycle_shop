module Mutations
  module Products
    class CreateProductsMutation < BaseMutation
      argument :input, Inputs::CreateProductDefinitionInput, required: true

      field :product, Types::ProductDefinitionType, null: true
      field :errors, [String], null: false

      def resolve(input:)
        params = input.to_h
        product_selections = params.delete(:product_selections)
        product = Product.new(input.to_h)
        product.product_selections = product_selections.map do |product_selection|
          ProductSelection.new(product_selection.to_h)
        end
        if product.save
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