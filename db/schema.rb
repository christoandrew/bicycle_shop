# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_01_03_145646) do
  create_table "cart_items", force: :cascade do |t|
    t.integer "cart_id", null: false
    t.integer "product_id", null: false
    t.integer "quantity", default: 1, null: false
    t.text "selected_options", default: "{}", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["cart_id"], name: "index_cart_items_on_cart_id"
    t.index ["product_id"], name: "index_cart_items_on_product_id"
  end

  create_table "carts", force: :cascade do |t|
    t.string "session_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "checked_out_at"
  end

  create_table "compatibility_rules", force: :cascade do |t|
    t.integer "product_type_id", null: false
    t.integer "requiring_option_id", null: false
    t.integer "required_option_id", null: false
    t.string "rule_type", null: false
    t.boolean "active", default: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["product_type_id", "requiring_option_id", "required_option_id", "rule_type"], name: "idx_unique_compatibility_rule", unique: true
    t.index ["product_type_id"], name: "index_compatibility_rules_on_product_type_id"
    t.index ["required_option_id"], name: "index_compatibility_rules_on_required_option_id"
    t.index ["requiring_option_id"], name: "index_compatibility_rules_on_requiring_option_id"
  end

  create_table "part_categories", force: :cascade do |t|
    t.string "name", null: false
    t.boolean "required", default: true
    t.integer "product_type_id", null: false
    t.integer "position", default: 0, null: false
    t.boolean "active", default: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_part_categories_on_name"
    t.index ["position"], name: "index_part_categories_on_position"
    t.index ["product_type_id"], name: "index_part_categories_on_product_type_id"
  end

  create_table "part_options", force: :cascade do |t|
    t.string "name", null: false
    t.decimal "price", precision: 10, scale: 2, null: false
    t.integer "part_category_id", null: false
    t.integer "position", default: 0, null: false
    t.boolean "in_stock", default: true
    t.integer "stock_quantity", default: 0
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["in_stock"], name: "index_part_options_on_in_stock"
    t.index ["name"], name: "index_part_options_on_name"
    t.index ["part_category_id"], name: "index_part_options_on_part_category_id"
    t.index ["position"], name: "index_part_options_on_position"
  end

  create_table "price_rule_conditions", force: :cascade do |t|
    t.integer "price_rule_id", null: false
    t.integer "part_option_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["part_option_id"], name: "index_price_rule_conditions_on_part_option_id"
    t.index ["price_rule_id"], name: "index_price_rule_conditions_on_price_rule_id"
  end

  create_table "price_rules", force: :cascade do |t|
    t.string "description", null: false
    t.boolean "active", default: true
    t.integer "product_type_id", null: false
    t.decimal "price", precision: 10, scale: 2, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["active"], name: "index_price_rules_on_active"
    t.index ["product_type_id"], name: "index_price_rules_on_product_type_id"
  end

  create_table "product_selections", force: :cascade do |t|
    t.integer "product_id", null: false
    t.integer "part_option_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["part_option_id"], name: "index_product_selections_on_part_option_id"
    t.index ["product_id"], name: "index_product_selections_on_product_id"
  end

  create_table "product_types", force: :cascade do |t|
    t.string "name", null: false
    t.string "code", null: false
    t.string "description"
    t.boolean "active", default: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["code"], name: "index_product_types_on_code"
    t.index ["name"], name: "index_product_types_on_name"
  end

  create_table "products", force: :cascade do |t|
    t.string "name", null: false
    t.text "description"
    t.decimal "base_price", precision: 10, scale: 2, null: false
    t.boolean "preconfigured", default: false
    t.integer "product_type_id", null: false
    t.boolean "in_stock", default: true
    t.boolean "active", default: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_products_on_name", unique: true
    t.index ["product_type_id"], name: "index_products_on_product_type_id"
  end

  add_foreign_key "cart_items", "carts"
  add_foreign_key "cart_items", "products"
  add_foreign_key "compatibility_rules", "part_options", column: "required_option_id"
  add_foreign_key "compatibility_rules", "part_options", column: "requiring_option_id"
  add_foreign_key "compatibility_rules", "product_types"
  add_foreign_key "part_categories", "product_types"
  add_foreign_key "part_options", "part_categories"
  add_foreign_key "price_rule_conditions", "part_options"
  add_foreign_key "price_rule_conditions", "price_rules"
  add_foreign_key "price_rules", "product_types"
  add_foreign_key "product_selections", "part_options"
  add_foreign_key "product_selections", "products"
  add_foreign_key "products", "product_types"
end
