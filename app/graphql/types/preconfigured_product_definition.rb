module Types
  class PreconfiguredProductDefinition < GraphQL::Schema::Object
    description "A preconfigured product definition"

    field :id, ID, null: false
    field :name, String, null: false
    field :description, String, null: false
    field :base_price, Float, null: false
    field :product_type_id, ID, null: false
    field :active, Boolean, null: false
    field :preconfigured, Boolean, null: false
  end
end