module Types
  class ProductDefinitionType < GraphQL::Schema::Object
    description "A product in Marcus' shop"

    field :id, ID, null: false
    field :name, String, null: false
    field :description, String, null: true
    field :base_price, Float, null: false
    field :preconfigured, Boolean, null: false
    field :product_type, ProductTypeDefinitionType, null: false
    field :in_stock, Boolean, null: false
    field :active, Boolean, null: false
    field :product_selections, [ProductSelectionType], null: false


    def product_selection
      object.product_selections
    end
  end
end
