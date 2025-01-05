class CompatibilityRule < ActiveRecord::Base
  belongs_to :product_type
  belongs_to :requiring_option, class_name: 'PartOption'
  belongs_to :required_option, class_name: 'PartOption'

  validates :rule_type, presence: true, inclusion: { in: %w[requires excludes] }
  validate :options_belong_to_same_product_type
  validate :options_are_different
  validate :no_conflicting_rules
  validate :part_categories_are_not_the_same

  scope :active, -> { where(active: true) }

  private

  def options_belong_to_same_product_type
    unless requiring_option.part_category.product_type_id == product_type_id &&
      required_option.part_category.product_type_id == product_type_id
      errors.add(:base, "Both options must belong to the same product type")
    end
  end

  def options_are_different
    if requiring_option_id == required_option_id
      errors.add(:base, "Cannot create a rule between the same option")
    end
  end

  def no_conflicting_rules
    conflicting_rule = CompatibilityRule
                         .where.not(id: id)
                         .where(
                           product_type_id: product_type_id,
                           requiring_option_id: requiring_option_id,
                           required_option_id: required_option_id
                         )
                         .where.not(rule_type: rule_type)
                         .exists?

    if conflicting_rule
      errors.add(:base, "Conflicting rule already exists for these options")
    end
  end

  def part_categories_are_not_the_same
    if requiring_option.part_category_id == required_option.part_category_id
      errors.add(:base, "Cannot create a rule between the same part category")
    end
  end
end