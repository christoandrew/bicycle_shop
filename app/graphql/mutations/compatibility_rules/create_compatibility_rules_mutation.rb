module Mutations
  module CompatibilityRules
    class CreateCompatibilityRulesMutation < BaseMutation
      argument :input, Inputs::CreateCompatibilityRuleInput, required: true

      field :compatibility_rule, Types::CompatibilityRuleType, null: true
      field :errors, [String], null: false

      def resolve(input:)
        rule = CompatibilityRule.new(
          product_type_id: input.product_type_id,
          requiring_option_id: input.requiring_option_id,
          required_option_id: input.required_option_id,
          rule_type: input.rule_type
        )

        if rule.save
          { compatibility_rule: rule, errors: [] }
        else
          { compatibility_rule: nil, errors: rule.errors.full_messages }
        end
      end
    end
  end
end