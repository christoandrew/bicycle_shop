module Mutations
  module Products
    class UpdateProductsMutation < BaseMutation
      argument :input, Inputs::UpdateProductDefinitionInput, required: true

      field :product, Types::ProductDefinitionType, null: true
      field :errors, [String], null: false

      def resolve(input:)
        params = input.to_h
        product = Product.find(params[:id])
        product_selections = params.delete(:product_selections)
        product.product_selections = product_selections.map do |product_selection|
          ProductSelection.new(product_selection.to_h)
        end

        if product.update(params)
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