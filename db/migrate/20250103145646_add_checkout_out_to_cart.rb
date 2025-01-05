class AddCheckoutOutToCart < ActiveRecord::Migration[8.0]
  def change
    add_column :carts, :checked_out_at, :datetime, default: nil
  end
end
