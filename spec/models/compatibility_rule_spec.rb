RSpec.describe CompatibilityRule, type: :model do
  it { should belong_to(:product_type) }
  it { should validate_inclusion_of(:rule_type).in_array(%w[requires excludes]) }
  it { should validate_presence_of(:requiring_option) }
  it { should validate_presence_of(:required_option) }
  it { should validate_presence_of(:product_type) }


  context 'validations' do
    let(:product_type) { create(:product_type) }
    let(:frame_category) { create(:frame_category, product_type: product_type) }
    let(:finish_category) { create(:finish_category, product_type: product_type) }
    let(:full_suspension_option) { create(:full_suspension_option, part_category: frame_category) }
    let(:matte_finish_option) { create(:matte_finish_option, part_category: finish_category) }
    let(:compatibility_rule) {
      build(:compatibility_rule,
             product_type: product_type,
             requiring_option: full_suspension_option,
             required_option: matte_finish_option)
    }

    it 'validates that requiring_option and required_option belong to the same product type' do
      ski_product_type = create(:ski_type)
      matte_finish_category_on_ski = create(:finish_category, product_type: ski_product_type)
      matte_finish_on_ski = create(:matte_finish_option, part_category: matte_finish_category_on_ski)
      compatibility_rule = CompatibilityRule.new(
        product_type: product_type,
        requiring_option: full_suspension_option,
        required_option: matte_finish_on_ski
      )
      expect(compatibility_rule.valid?). to be_falsey
      expect(compatibility_rule.errors[:base]).to include("Both options must belong to the same product type")
    end

    it 'validates that requiring_option and required_option are different' do
      compatibility_rule.required_option = full_suspension_option
      expect(compatibility_rule.valid?).to be_falsey
      expect(compatibility_rule.errors[:base]).to include("Cannot create a rule between the same option")
    end

    it 'validates that no conflicting rules exist' do
      compatibility_rule.save
      conflicting_rule = compatibility_rule.dup
      expect{
        conflicting_rule.save
      }.to raise_error(ActiveRecord::RecordNotUnique)
    end

    it 'validates that requiring_option and required_option belong to different part categories' do
      matte_finish_option.part_category = frame_category
      expect(compatibility_rule.valid?).to be_falsey
      expect(compatibility_rule.errors[:base]).to include("Cannot create a rule between the same part category")
    end
  end

end