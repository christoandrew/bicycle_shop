module Types
  class ProductSelectionType < GraphQL::Schema::Object
    description "A product selection"

    field :id, ID, null: false
    field :product_id, ID, null: false
    field :part_option, Types::PartOptionType, null: false

    def part_option
      object.part_option
    end
  end
end