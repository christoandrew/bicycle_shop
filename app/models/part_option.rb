class PartOption < ActiveRecord::Base
  belongs_to :part_category

  validates_presence_of :part_category
  validates_presence_of :name, :price, :position

  default_scope { order("position ASC") }
end