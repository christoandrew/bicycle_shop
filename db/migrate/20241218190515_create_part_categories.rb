class CreatePartCategories < ActiveRecord::Migration[8.0]
  def change
    create_table :part_categories do |t|
      t.string :name, null: false
      t.boolean :required, default: true
      t.references :product_type, null: false, foreign_key: true
      t.integer :position, null: false, default: 0
      t.boolean :active, default: true

      t.timestamps
    end

    add_index :part_categories, :name unless index_exists?(:part_categories, :name)
    add_index :part_categories, :product_type_id unless index_exists?(:part_categories, :product_type_id)
    add_index :part_categories, :position unless index_exists?(:part_categories, :position)
  end
end
