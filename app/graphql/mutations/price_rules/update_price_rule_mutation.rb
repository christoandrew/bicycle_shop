module Mutations
  module PriceRules
    class UpdatePriceRuleMutation < BaseMutation
      argument :input, Inputs::UpdatePriceRuleInput, required: true

      field :price_rule, Types::PriceRuleType, null: true
      field :errors, [String], null: true

      def resolve(input:)
        price_rule = PriceRule.find(input[:id])

        if price_rule.update(input.to_h)
          {
            price_rule: price_rule,
            errors: []
          }
        else
          {
            errors: price_rule.errors.full_messages,
            price_rule: nil
          }
        end
      end
    end
  end
end