RSpec.describe PartCategory, type: :model do
  it { is_expected.to have_many(:part_options) }
  it { is_expected.to validate_presence_of(:name) }
  it { is_expected.to validate_presence_of(:product_type) }
end