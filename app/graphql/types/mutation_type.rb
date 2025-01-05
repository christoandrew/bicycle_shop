module Types
  class MutationType < GraphQL::Schema::Object
    field :create_product, mutation: Mutations::Products::CreateProductsMutation
    field :update_product, mutation: Mutations::Products::UpdateProductsMutation
    field :delete_product, mutation: Mutations::Products::DeleteProductsMutation

    field :create_product_type, mutation: Mutations::ProductTypes::CreateProductTypesMutation
    field :update_product_type, mutation: Mutations::ProductTypes::UpdateProductTypesMutation
    field :delete_product_type, mutation: Mutations::ProductTypes::DeleteProductTypesMutation

    field :create_part_category, mutation: Mutations::PartCategories::CreatePartCategoryMutation
    field :update_part_category, mutation: Mutations::PartCategories::UpdatePartCategoryMutation
    field :delete_part_category, mutation: Mutations::PartCategories::DeletePartCategoryMutation

    field :create_part_option, mutation: Mutations::PartOptions::CreatePartOptionMutation
    field :update_part_option, mutation: Mutations::PartOptions::UpdatePartOptionMutation
    field :delete_part_option, mutation: Mutations::PartOptions::DeletePartOptionMutation

    field :create_price_rule, mutation: Mutations::PriceRules::CreatePriceRuleMutation
    field :update_price_rule, mutation: Mutations::PriceRules::UpdatePriceRuleMutation
    field :delete_price_rule, mutation: Mutations::PriceRules::DeletePriceRuleMutation

    field :create_compatibility_rule, mutation: Mutations::CompatibilityRules::CreateCompatibilityRulesMutation
    field :update_compatibility_rule, mutation: Mutations::CompatibilityRules::UpdateCompatibilityRulesMutation
    field :delete_compatibility_rule, mutation: Mutations::CompatibilityRules::DeleteCompatibilityRulesMutation

    field :add_to_cart, mutation: Mutations::Cart::AddToCartMutation
    field :checkout_cart, mutation: Mutations::Cart::CheckoutMutation
  end
end