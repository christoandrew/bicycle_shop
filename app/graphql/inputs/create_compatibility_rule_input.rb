module Inputs
  class CreateCompatibilityRuleInput < GraphQL::Schema::InputObject
    description "Attributes for creating a compatibility rule"

    argument :product_type_id, ID, required: true
    argument :requiring_option_id, ID, required: true
    argument :required_option_id, ID, required: true
    argument :rule_type, String, required: true
    argument :active, Boolean, required: false
  end
end