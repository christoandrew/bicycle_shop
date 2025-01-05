class CreatePriceRuleConditions < ActiveRecord::Migration[8.0]
  def change
    create_table :price_rule_conditions do |t|
      t.references :price_rule, null: false, foreign_key: true
      t.references :part_option, null: false, foreign_key: true

      t.timestamps
    end

    add_index :price_rule_conditions, :price_rule_id unless index_exists?(:price_rule_conditions, :price_rule_id)
    add_index :price_rule_conditions, :part_option_id unless index_exists?(:price_rule_conditions, :part_option_id)
  end
end
