module Types
  class PartOptionType < GraphQL::Schema::Object
    description 'Part Option for product part category'

    field :id, ID, null: false
    field :name, String, null: false
    field :in_stock, Boolean
    field :price, Float, null: false
    field :stock_quantity, Integer
    field :part_category, PartCategoryType, null: true
    field :part_category_id, ID, null: false
    field :position, Integer, null: false
  end
end
