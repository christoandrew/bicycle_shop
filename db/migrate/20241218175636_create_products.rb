class CreateProducts < ActiveRecord::Migration[8.0]
  def change
    create_table :products do |t|
      t.string :name, null: false
      t.text :description
      t.decimal :base_price, precision: 10, scale: 2, null: false
      t.boolean :preconfigured, default: false
      t.references :product_type, null: false, foreign_key: true
      t.boolean :in_stock, default: true
      t.boolean :active, default: true

      t.timestamps
    end

    add_index :products, :name, unique: true
  end
end