
module Types
  class ProductTypeDefinitionType < GraphQL::Schema::Object
    field :id, ID, null: false
    field :name, String, null: false
    field :code, String, null: false
    field :description, String, null: true
    field :active, Boolean, null: false
    field :price_rules, [PriceRuleType], null: false
    field :part_categories, [PartCategoryType], null: false
  end
end