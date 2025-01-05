class CreateProductTypes < ActiveRecord::Migration[8.0]
  def change
    create_table :product_types do |t|
      t.string :name, null: false
      t.string :code, null: false
      t.string :description
      t.boolean :active, default: true

      t.timestamps
    end

    add_index :product_types, :name
    add_index :product_types, :code
  end
end
