class Product < ActiveRecord::Base
  has_many :product_selections
  has_many :part_options, through: :product_selections
  belongs_to :product_type

  validates_presence_of :name, :base_price, :product_type

  scope :preconfigured, -> { where(preconfigured: true) }
  scope :customizable, -> { where(preconfigured: false) }
  scope :by_product_type, ->(product_type) { where(product_type: product_type) }
  scope :active, -> { where(active: true) }

  delegate :price_rules, to: :product_type, allow_nil: true

  def configurable?
    preconfigured? == false
  end

  def calculate_price(selected_option_ids)
    return base_price if selected_option_ids.empty?

    total = base_price
    # Based off the selected options, get the price rules that apply
    applicable_rules = price_rules.select{|rule| rule.applies?(selected_option_ids) }
    # Get the part options attached to the rules
    options_in_rules = applicable_rules.flat_map{|rule| rule.part_options.pluck(:id) }
    # Only apply prices directly that don't fulfill the rules
    selected_option_ids.each do |option_id|
      unless options_in_rules.include?(option_id)
        option = PartOption.find(option_id)
        total += option.price
      end
    end

    # Apply the price from the rules
    applicable_rules.each do |rule|
      total += rule.price
    end

    total
  end

  def dup
    super.tap do |product|
      product.name = "#{name} (##{ Nanoid.generate(size: 10) })"
      product.active = false
      product.preconfigured = false
      product.base_price = base_price
      product.product_type = product_type
    end
  end
end
