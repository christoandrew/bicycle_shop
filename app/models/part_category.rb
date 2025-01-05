# frozen_string_literal: true

class PartCategory < ActiveRecord::Base
  has_many :part_options
  belongs_to :product_type, class_name: '::ProductType', foreign_key: 'product_type_id'

  validates :name, :product_type, presence: true

  default_scope { order("position ASC") }
end