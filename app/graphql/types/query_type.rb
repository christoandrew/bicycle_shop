module Types
  class QueryType < GraphQL::Schema::Object
    description "The query root for Marcus' shop"

    # Fetch all products
    field :products, [ProductDefinitionType], null: false

    def products
      Product.includes(:product_type).all
    end

    # Fetch a single product by ID
    field :product, ProductDefinitionType, null: false do
      argument :id, ID, required: true
    end

    def product(id:)
      Product.find(id)
    end

    # Fetch all preconfigured products for the homepage
    field :preconfigured_products, [ProductDefinitionType], null: false do
      description "Preconfigured products for the homepage"
      argument :product_type, String, required: true
    end

    def preconfigured_products(product_type: nil)
      Product.preconfigured
             .active
             .joins(:product_type)
             .where(product_types: { code: product_type })
    end

    # Get all products of a specific type
    field :products_by_type, [ProductDefinitionType], null: false do
      argument :product_type, String, required: true
    end

    def products_by_type(product_type:)
      Product.by_product_type(product_type)
    end

    field :product_types, [ProductTypeDefinitionType], null: false do
      description "All product types"
      argument :active, Boolean, required: false
    end

    def product_types(active: nil)
      active ? ProductType.active : ProductType.all
    end

    field :part_categories, [PartCategoryType], null: false

    def part_categories(*args)
      PartCategory.includes(:product_type).all
    end

    field :part_categories_by_product_type_code, [PartCategoryType], null: false do
      argument :product_type_code, String, required: true
    end

    def part_categories_by_product_type_code(product_type_code:)
      PartCategory.where(product_types: { code: product_type_code }).joins(:product_type)
    end

    field :part_categories_by_product_type_id, [PartCategoryType], null: false do
      argument :product_type_id, ID, required: true
    end

    def part_categories_by_product_type_id(product_type_id:)
      PartCategory.where(product_types: { id: product_type_id }).joins(:product_type)
    end

    field :part_category, PartCategoryType, null: false do
      argument :id, ID, required: true
    end

    def part_category(id:)
      PartCategory.find(id)
    end

    field :part_options, [PartOptionType], null: false

    def part_options
      PartOption.includes(part_category: :product_type).all
    end

    field :part_options_by_part_category_id, [PartOptionType], null: false do
      argument :part_category_id, ID, required: true
    end

    def part_options_by_part_category_id(part_category_id:)
      PartOption.where(part_category_id: part_category_id).includes(part_category: :product_type)
    end

    field :part_option, PartOptionType, null: false do
      argument :id, ID, required: true
    end

    def part_option(id:)
      PartOption.find(id)
    end

    field :price_rules, [Types::PriceRuleType], null: false

    def price_rules
      PriceRule.includes(price_rule_conditions: :part_option).all
    end

    field :compatibility_rules, [Types::CompatibilityRuleType], null: false

    def compatibility_rules
      CompatibilityRule.includes(:requiring_option, :required_option).all
    end

    field :compatibility_rule, Types::CompatibilityRuleType, null: false do
      argument :id, ID, required: true
    end

    def compatibility_rule(id:)
      CompatibilityRule.includes(:requiring_option, :required_option).find(id)
    end

    field :compatibility_rules_for_product_type, [Types::CompatibilityRuleType], null: false do
      argument :product_type_id, ID, required: true
    end

    def compatibility_rules_for_product_type(product_type_id:)
      CompatibilityRule.includes(:requiring_option, :required_option)
                      .where(product_type_id: product_type_id).active
    end

    field :price_rules_for_product_type, [Types::PriceRuleType], null: false do
      argument :product_type_id, ID, required: true
    end

    def price_rules_for_product_type(product_type_id:)
      PriceRule.includes(price_rule_conditions: :part_option)
               .where(product_type_id: product_type_id).active
    end

    field :cart, CartType, null: false do
      argument :session_id, String, required: true
    end

    def cart(session_id:)
      cart = ::Cart.where(session_id: session_id, checked_out_at: nil).first
      cart ||= ::Cart.create(session_id: session_id)
      {
        id: cart.id,
        session_id: cart.session_id,
        cart: cart
      }
    end

    field :orders, [OrderType], null: false do
      argument :session_id, String, required: false
    end

    def orders(session_id: nil)
      if session_id.present?
        ::Cart.where(session_id: session_id).where.not(checked_out_at: nil)
      else
        ::Cart.includes(:cart_items).where.not(checked_out_at: nil)
      end
    end
  end
end

