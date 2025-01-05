# frozen_string_literal: true
class PriceRuleCondition < ActiveRecord::Base
  belongs_to :price_rule
  belongs_to :part_option

  delegate :part_category, to: :part_option

end