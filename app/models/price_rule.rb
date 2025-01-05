class PriceRule < ActiveRecord::Base
  belongs_to :product_type
  has_many :price_rule_conditions, dependent: :destroy
  has_many :part_options, through: :price_rule_conditions


  validates_presence_of :description
  validates :price, presence: true, numericality: { greater_than_or_equal_to: 0 }

  scope :active, -> { where(active: true) }

  def applies?(part_option_ids)
    part_options.all?{|option| part_option_ids.include?(option.id) }
  end
end