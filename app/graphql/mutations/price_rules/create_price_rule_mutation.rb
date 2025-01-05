module Mutations
  module PriceRules
    class CreatePriceRuleMutation < BaseMutation
      argument :input, Inputs::CreatePriceRuleInput, required: true

      field :price_rule, Types::PriceRuleType, null: true
      field :errors, [String], null: true

      def resolve(input:)
        price_rule = PriceRule.new(input.to_h)

        if price_rule.save
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