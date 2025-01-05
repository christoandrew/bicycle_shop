module Types
  class CompatibilityRuleType < GraphQL::Schema::Object
    field :id, ID, null: false
    field :product_type_id, ID, null: false
    field :requiring_option_id, ID, null: false
    field :required_option_id, ID, null: false
    field :rule_type, String, null: false
    field :product_type, ProductTypeDefinitionType, null: true
    field :requiring_option, PartOptionType, null: true
    field :required_option, PartOptionType, null: true
    field :active, Boolean, null: false

    def product_type
      object.product_type
    end

    def requiring_option
      object.requiring_option
    end

    def required_option
      object.required_option
    end
  end
end