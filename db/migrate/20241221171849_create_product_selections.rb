class CreateProductSelections < ActiveRecord::Migration[8.0]
  def change
    create_table :product_selections do |t|
      t.references :product, null: false, foreign_key: true
      t.references :part_option, null: false, foreign_key: true

      t.timestamps
    end

    add_index :product_selections, :product_id unless index_exists?(:product_selections, :product_id)
    add_index :product_selections, :part_option_id unless index_exists?(:product_selections, :part_option_id)
  end
end
