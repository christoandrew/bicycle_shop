# frozen_string_literal: true

RSpec.describe Cart, type: :model do
  it { should have_many(:cart_items).dependent(:destroy) }

  it { should validate_presence_of(:session_id) }
end

