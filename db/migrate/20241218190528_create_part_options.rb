class CreatePartOptions < ActiveRecord::Migration[8.0]
  def change
    create_table :part_options do |t|
      t.string :name, null: false
      t.decimal :price, precision: 10, scale: 2, null: false
      t.references :part_category, null: false, foreign_key: true
      t.integer :position, null: false, default: 0
      t.boolean :in_stock, default: true
      t.integer :stock_quantity, default: 0

      t.timestamps
    end

    add_index :part_options, :name unless index_exists?(:part_options, :name)
    add_index :part_options, :part_category_id unless index_exists?(:part_options, :part_category_id)
    add_index :part_options, :position unless index_exists?(:part_options, :position)
    add_index :part_options, :in_stock unless index_exists?(:part_options, :in_stock)
  end
end
