module Mutations
  module PartCategories
    class UpdatePartCategoryMutation < BaseMutation
      argument :input, Inputs::UpdatePartCategoryInput, required: true

      field :part_category, Types::PartCategoryType, null: true
      field :errors, [String], null: true

      def resolve(input:)
        part_category = PartCategory.find(input[:id])

        if part_category.update(input.to_h)
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