module Types
  class PriceRuleCondition < GraphQL::Schema::Object
    description "A condition for a price rule"

    field :id, ID, null: false
    field :price_rule_id, ID, null: false
    field :part_option_id, ID, null: false
    field :part_option, String, null: false

    def part_option
      object.part_option.name
    end
  end
end