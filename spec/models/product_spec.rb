require './spec/spec_helper'
require 'pry'

RSpec.describe Product, type: :model do
  let(:bicycle_product) { create(:bicycle_product) }
  let(:bicycle_frame_category) { create(:bicycle_frame_category, product: bicycle_product) }
  let(:bicycle_tire_category) { create(:bicycle_tire_category, product: bicycle_product) }
  let(:bicycle_wheel_category) { create(:bicycle_wheel_category, product: bicycle_product) }

  let(:full_suspension) { create(:full_suspension_frame_option, part_category: bicycle_frame_category) }
  let(:tubeless_tire) { create(:tubeless_tire_option, part_category: bicycle_tire_category) }
  let(:aero_wheel) { create(:aero_wheel_option, part_category: bicycle_wheel_category) }

  let(:matte_finish) { create(:matte_finish_option) }

  it { is_expected.to validate_presence_of(:name) }
  it { is_expected.to validate_presence_of(:base_price) }

  it 'is valid with a name, base_price, and type' do
    product = Product.new(
      name: 'Test Product',
      base_price: 10.00,
      product_type: 'test'
    )
    expect(product).to be_valid
    expect{ product.save }.to change{ Product.count }.by(1)
  end

  context '#calculate_price' do
    it 'withouts custom options returns the base price' do
      bicycle_product = create(:bicycle_product)
      # Currently the base price is 199.99
      expect(bicycle_product.calculate_price([])).to eq(199.99)
    end

    it 'returns correct price without rules' do
      selected_options = [
        full_suspension.id,
        tubeless_tire.id,
        aero_wheel.id
      ]

      # The base price is 199.99
      # The full suspension frame is 9.99
      # The tubeless tire is 9.99
      # The aero wheel is 9.99
      # The total should be 229.96
      expect_price = bicycle_product.base_price + full_suspension.price + tubeless_tire.price + aero_wheel.price
      expect(bicycle_product.calculate_price(selected_options)).to eq(expect_price)
    end

    it 'returns correct price with rules' do
      product = create(:bicycle_product)
      # Currently the base price is 199.99
      # The full suspension frame is 9.99
      # Matte finish is 9.99
      # Individually the total should be 199.99 + 9.99 + 9.99 = 219.97
      # The total should be 199.9 + 69.99 = 269.97 with rule applied
      selected_options = [
        full_suspension.id,
        matte_finish.id
      ]

      expected_price = product.base_price + full_suspension.price + matte_finish.price
      expect(product.calculate_price(selected_options)).to eq(expected_price)

      # Now we add the price rule
      # matte_finish_on_full_suspension_frame_rule
      # From rule matte finish on full suspension frame is 69.99
      matte_finish_on_full_suspension_frame_rule = create(:matte_finish_on_full_suspension_frame_rule, product: product)
      matte_finish_on_full_suspension_frame_rule.part_options << full_suspension
      matte_finish_on_full_suspension_frame_rule.part_options << matte_finish

      expect(product.reload.calculate_price(selected_options).to_i).to eq(269)
    end
  end
end
