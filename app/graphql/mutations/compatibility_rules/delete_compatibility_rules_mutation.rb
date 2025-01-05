module Mutations
  module CompatibilityRules
    class DeleteCompatibilityRulesMutation < BaseMutation
      argument :id, ID, required: true

      field :compatibility_rule, Types::CompatibilityRuleType, null: true
      field :errors, [String], null: true

      def resolve(id:)
        rule = CompatibilityRule.find(id)

        if rule.destroy
          {
            errors: []
          }
        else
          {
            errors: rule.errors.full_messages,
          }
        end
      end
    end
  end
end