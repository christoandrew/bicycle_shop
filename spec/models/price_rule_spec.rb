RSpec.describe :price_rule do
  context "#applies?" do
    it "returns true if all conditions are met" do
      price_rule = create(:price_rule)
      full_suspension_option = create(:full_suspension_option)
      matte_finish_option = create(:matte_finish_option)
      create(:price_rule_condition, price_rule: price_rule, part_option: full_suspension_option)
      create(:price_rule_condition, price_rule: price_rule, part_option: matte_finish_option)

      expect(price_rule.applies?([full_suspension_option.id, matte_finish_option.id])).to eq(true)
    end
  end
end