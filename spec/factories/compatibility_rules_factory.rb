FactoryBot.define do
  factory :compatibility_rule do
    rule_type { "requires" }
    active { true }
    association :product_type
    association :requiring_option, factory: :part_option
    association :required_option, factory: :part_option

    factory :requires_rule do
      rule_type { "requires" }
    end

    factory :excludes_rule do
      rule_type { "excludes" }
    end
  end
end