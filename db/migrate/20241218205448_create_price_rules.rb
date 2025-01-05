class CreatePriceRules < ActiveRecord::Migration[8.0]
  def change
    create_table :price_rules do |t|
      t.string :description, null: false
      t.boolean :active, default: true
      t.references :product_type, null: false, foreign_key: true
      t.decimal :price, precision: 10, scale: 2, null: false

      t.timestamps
    end

    add_index :price_rules, :product_type_id unless index_exists?(:price_rules, :product_type_id)
    add_index :price_rules, :active unless index_exists?(:price_rules, :active)
  end
end
