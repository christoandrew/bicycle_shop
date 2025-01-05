class ProductType < ActiveRecord::Base
  has_many :part_categories
  has_many :price_rules
  has_many :products, dependent: :restrict_with_error
  has_many :part_options, through: :part_categories
  has_many :price_rules
  has_many :compatibility_rules

  validates :name, presence: true, uniqueness: true
  validates :code, presence: true, uniqueness: true

  scope :active, -> { where(active: true) }
  scope :ordered, -> { order(position: :asc) }


  # This is currently done client side. Need to decide if I should
  # move it server side
  def available_options_for_category(category, selected_options = {})
    return [] unless category.product_type_id == id

    options = category.part_options.in_stock.active

    return options if selected_options.empty?

    selected_options.each do |_category_id, option_id|
      selected_option = PartOption.find(option_id)

      # Apply "requires" rules
      requires_rules = compatibility_rules.active
                                          .where(requiring_option: selected_option, rule_type: 'requires')
                                          .where(required_option: options)

      if requires_rules.exists?
        # Only show options that are required by the selected option
        options = options.where(id: requires_rules.select(:required_option_id))
      end

      # Apply "excludes" rules
      excludes_rules = compatibility_rules.active
                                          .where(requiring_option: selected_option, rule_type: 'excludes')
                                          .where(required_option: options)

      if excludes_rules.exists?
        # Remove options that are excluded by the selected option
        options = options.where.not(id: excludes_rules.select(:required_option_id))
      end
    end

    options
  end

  def validate_configuration(selected_options)
    # First check if all required categories have selections
    required_categories = part_categories.where(required: true)
    missing_categories = required_categories.reject do |category|
      selected_options.key?(category.id)
    end

    if missing_categories.any?
      return [false, "Missing selections for required parts: #{missing_categories.map(&:name).join(', ')}"]
    end

    # Then check compatibility rules
    valid, message = validate_compatibility(selected_options)
    [valid, message]
  end

  def validate_compatibility(selected_options)
    selected_options.each do |category_id, option_id|
      selected_option = PartOption.find(option_id)

      # Check "requires" rules
      required_options = compatibility_rules.active
                                            .where(requiring_option: selected_option, rule_type: 'requires')
                                            .pluck(:required_option_id)

      unless (required_options - selected_options.values).empty?
        return false, "Selected options are missing required dependencies"
      end

      # Check "excludes" rules
      excluded_options = compatibility_rules.active
                                            .where(requiring_option: selected_option, rule_type: 'excludes')
                                            .pluck(:required_option_id)

      unless (excluded_options & selected_options.values).empty?
        return false, "Selected options contain incompatible combinations"
      end
    end

    [true, nil]
  end
end