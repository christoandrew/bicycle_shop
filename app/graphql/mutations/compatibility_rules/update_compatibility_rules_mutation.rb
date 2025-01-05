module Mutations
  module CompatibilityRules
    class UpdateCompatibilityRulesMutation < BaseMutation
      argument :input, Inputs::UpdateCompatibilityRuleInput, required: true

      field :compatibility_rule, Types::CompatibilityRuleType, null: true
      field :errors, [String], null: false

      def resolve(input:)
        rule = CompatibilityRule.find(input.id)

        if rule.update(input.to_h)
          {
            compatibility_rule: rule,
            errors: []
          }
        else
          {
            compatibility_rule: nil,
            errors: rule.errors.full_messages
          }
        end
      end
    end
  end
end