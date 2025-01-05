module Inputs
  class UpdateCompatibilityRuleInput < CreateCompatibilityRuleInput
    description "Attributes for updating a compatibility rule"

    argument :id, ID, required: true
  end
end