FactoryBot.define do
  factory :price_rule_condition do
    association :price_rule
    association :part_option
  end
end