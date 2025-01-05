module Types
  class PartCategoryType < GraphQL::Schema::Object
    description "A part category in Marcus' shop"

    field :id, ID, null: false
    field :name, String, null: false
    field :position, Integer
    field :product_type_id, ID, null: false
    field :required, Boolean, null: false
    field :active, Boolean, null: false
    field :part_options, [PartOptionType], null: false
    field :product_type, ProductTypeDefinitionType, null: false

  end
end