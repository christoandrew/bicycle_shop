RSpec.describe ProductType, type: :model do
  describe 'validations' do
    it { is_expected.to validate_presence_of(:name) }
    it { is_expected.to validate_presence_of(:code) }
    it { is_expected.to have_many(:part_categories) }
    it { is_expected.to have_many(:price_rules) }
    it { is_expected.to have_many(:compatibility_rules) }
  end

  describe '#calculate_price' do
    let(:bicycle_type) { create(:product_type, name: 'Bicycle', code: 'bicycle') }

    let(:frame_category) do
      create(:part_category,
             name: 'Frame Type',
             product_type: bicycle_type,
             position: 1
      )
    end

    let(:finish_category) do
      create(:part_category,
             name: 'Frame Finish',
             product_type: bicycle_type,
             position: 2
      )
    end

    let(:wheel_category) do
      create(:part_category,
             name: 'Wheels',
             product_type: bicycle_type,
             position: 3
      )
    end

    let(:full_suspension) do
      create(:part_option,
             name: 'Full Suspension',
             price: 130.00,
             part_category: frame_category
      )
    end

    let(:matte_finish) do
      create(:part_option,
             name: 'Matte',
             price: 35.00,
             part_category: finish_category
      )
    end

    let(:road_wheels) do
      create(:part_option,
             name: 'Road Wheels',
             price: 80.00,
             part_category: wheel_category
      )
    end

    let(:bicycle_product) do
      create(:product,
             name: 'Custom Mountain Bike',
             base_price: 199.99,
             product_type: bicycle_type
      )
    end

    context 'with no options selected' do
      it 'returns the base price' do
        expect(bicycle_product.calculate_price([]))
          .to eq(bicycle_product.base_price)
      end
    end

    context 'with individual options' do
      it 'sums up individual option prices correctly' do
        selected_options = {
          frame_category.id => full_suspension.id,
          wheel_category.id => road_wheels.id
        }

        expected_price = bicycle_product.base_price +
          full_suspension.price +
          road_wheels.price

        expect(bicycle_product.calculate_price(selected_options.values))
          .to eq(expected_price)
      end
    end

    context 'with price rules' do
      let!(:matte_full_suspension_rule) do
        rule = create(:price_rule,
                      product_type: bicycle_type,
                      price: 50.00,  # Special price for matte on full suspension
                      description: 'Matte finish on full suspension frame'
        )
        create(:price_rule_condition, price_rule: rule, part_option: full_suspension)
        create(:price_rule_condition, price_rule: rule, part_option: matte_finish)
        rule
      end

      it 'applies price rules correctly' do
        selected_options = {
          frame_category.id => full_suspension.id,
          finish_category.id => matte_finish.id
        }

        # Base price (199.99) + rule price (50.00)
        expected_price = bicycle_product.base_price + matte_full_suspension_rule.price

        expect(bicycle_product.calculate_price(selected_options.values))
          .to eq(expected_price)
      end

      it 'handles mixed rule and individual pricing' do
        selected_options = {
          frame_category.id => full_suspension.id,
          finish_category.id => matte_finish.id,
          wheel_category.id => road_wheels.id
        }

        # Base price (199.99) + rule price (50.00) + road wheels (80.00)
        expected_price = bicycle_product.base_price +
          matte_full_suspension_rule.price +
          road_wheels.price

        expect(bicycle_product.calculate_price(selected_options.values))
          .to eq(expected_price)
      end
    end
  end
end