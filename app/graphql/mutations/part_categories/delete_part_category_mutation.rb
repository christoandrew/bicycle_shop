module Mutations
  module PartCategories
    class DeletePartCategoryMutation < BaseMutation
      argument :id, ID, required: true

      field :part_category, Types::PartCategoryType, null: true
      field :errors, [String], null: true

      def resolve(id:)
        part_category = PartCategory.find(id)

        if part_category.destroy
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