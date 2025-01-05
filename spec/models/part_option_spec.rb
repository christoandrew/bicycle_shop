RSpec.describe PartOption, type: :model do
  describe 'validations' do
    it { should validate_presence_of(:part_category) }
    it { should validate_presence_of(:name) }
    it { should validate_presence_of(:price) }
    it { should validate_presence_of(:position) }
  end

  describe 'associations' do
    it { should belong_to(:part_category) }
  end

  describe 'default scope' do
    it 'orders by position ASC' do
      part_option1 = create(:part_option, position: 2)
      part_option2 = create(:part_option, position: 1)
      part_option3 = create(:part_option, position: 3)

      expect(PartOption.all).to eq([part_option2, part_option1, part_option3])
    end
  end
end