class CreateCompatibilityRules < ActiveRecord::Migration[8.0]
  def change
    create_table :compatibility_rules do |t|
      t.references :product_type, null: false, foreign_key: true
      t.references :requiring_option, null: false, foreign_key: { to_table: :part_options }
      t.references :required_option, null: false, foreign_key: { to_table: :part_options }
      t.string :rule_type, null: false  # 'requires' or 'excludes'
      t.boolean :active, default: true

      t.timestamps

      # Ensure we don't have duplicate rules
      t.index [:product_type_id, :requiring_option_id, :required_option_id, :rule_type],
              unique: true,
              name: 'idx_unique_compatibility_rule'
    end
  end
end
