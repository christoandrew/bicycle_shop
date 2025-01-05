# frozen_string_literal: true

require './spec/spec_helper'
require 'pry'

RSpec.describe ProductConfiguration, type: :model do
  describe 'associations' do
    #    it { is_expected.to belong_to(:product) }
    it { is_expected.to have_many(:part_categories) }
    it { is_expected.to have_many(:part_options).through(:configuration_selections) }
    it { is_expected.to have_many(:configuration_selections).dependent(:destroy) }
  end

  describe 'validations' do
    # it { is_expected.to validate_presence_of(:name) }
    # it { is_expected.to validate_presence_of(:product_id) }
    # it { is_expected.to validate_presence_of(:total_price) }
    #    it { is_expected.to validate_numericality_of(:total_price).is_greater_than_or_equal_to(0) }
  end

  describe '#total_price' do
    let(:bicycle_product) { create :bicycle_product }
    let(:bicycle_frame_category) { create :bicycle_frame_category, product: bicycle_product }
    let(:bicycle_tire_category) { create :bicycle_tire_category, product: bicycle_product }
    let(:bicycle_wheel_category) { create :bicycle_wheel_category, product: bicycle_product }

    let(:full_suspension) { create :full_suspension_frame_option, part_category: bicycle_frame_category }
    let(:tubeless_tire) { create :tubeless_tire_option, part_category: bicycle_tire_category }
    let(:aero_wheel) { create :aero_wheel_option, part_category: bicycle_wheel_category }

    let(:matte_finish) { create :matte_finish_option }

    context 'when creating a new configuration' do
      it 'calculates the total price of selected options' do
        allow(bicycle_product).to receive(:preconfigured?).and_return false
        product_configuration = create :product_configuration, product: bicycle_product, total_price: nil
        matte_finish_selection = create :matte_finish_selection, product_configuration: product_configuration,
          part_category: matte_finish.part_category, part_option: matte_finish
        full_suspension_selection = create :configuration_selection, product_configuration: product_configuration,
          part_category: full_suspension.part_category, part_option: full_suspension
        binding.irb
        # The base price is 199.99
        # The full suspension frame is 9.99
        # Matte finish is 9.99
        # Individually the total should be 199.99 + 9.99 + 9.99 = 219.97
        # But we have rules that apply
        # For matte finish with full suspension frame, the price is 69.99
        expect(product_configuration.total_price).to eq(269.97)

        expect(product_configuration.selected_options.pluck(:id)).to eq([full_suspension.id, matte_finish.id])
      end
    end
  end


end
