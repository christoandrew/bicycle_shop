module Types
  class PriceRuleType < GraphQL::Schema::Object
    description "A price rule for a product"

    field :id, ID, null: false
    field :description, String, null: false
    field :price, Float, null: false
    field :product_type_id, ID, null: false
    field :active, Boolean, null: false
    field :price_rule_applies_to, String, null: false
    field :part_options, [PartOptionType], null: false

    def price_rule_applies_to
      object.price_rule_conditions.map do |condition|
        condition.part_option.name
      end.join(", ")
    end

    def part_options
      object.price_rule_conditions.map do |condition|
        condition.part_option
      end
    end
  end
end