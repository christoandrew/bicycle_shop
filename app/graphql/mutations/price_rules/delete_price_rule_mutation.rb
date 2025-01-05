module Mutations
  module PriceRules
    class DeletePriceRuleMutation < BaseMutation
      argument :id, ID, required: true

      field :price_rule, Types::PriceRuleType, null: true
      field :errors, [String], null: true

      def resolve(id:)
        price_rule = PriceRule.find(id)

        if price_rule.destroy
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