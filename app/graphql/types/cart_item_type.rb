# frozen_string_literal: true

module Types
  class CartItemType < GraphQL::Schema::Object
    field :id, ID, null: false
    field :cart_id, ID, null: false
    field :product_id, ID, null: false
    field :quantity, Integer, null: false
    field :product, ProductDefinitionType, null: false
    field :total_price, Float, null: false
    field :part_options, [PartOptionType], null: false

    def product
      Product.find(object.product_id)
    end

    def total_price
      object.total_price
    end

    def part_options
      JSON.parse(object.selected_options).map do |option|
        PartOption.find(option["optionId"])
      end
    end
  end
end