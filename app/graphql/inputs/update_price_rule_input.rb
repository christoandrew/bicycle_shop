module Inputs
  class UpdatePriceRuleInput < CreatePriceRuleInput
    argument :id, ID, required: true
  end
end