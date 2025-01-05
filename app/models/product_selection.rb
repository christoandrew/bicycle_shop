class ProductSelection < ActiveRecord::Base
  belongs_to :product
  belongs_to :part_option

  delegate :part_category, to: :part_option, allow_nil: true

  validates_presence_of :product, :part_option
end