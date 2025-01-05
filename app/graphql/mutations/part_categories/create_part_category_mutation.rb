module Mutations
  module PartCategories
    class CreatePartCategoryMutation < BaseMutation
      argument :input, Inputs::CreatePartCategoryInput, required: true

      field :part_category, Types::PartCategoryType, null: true
      field :errors, [String], null: true

      def resolve(input:)
        part_category = PartCategory.new(input.to_h)

        if part_category.save
          {
            part_category: part_category,
            errors: []
          }
        else
          {
            errors: part_category.errors.full_messages,
            part_category: nil
          }
        end
      end
    end
  end
end