module Mutations
  module PartOptions
    class DeletePartOptionMutation < BaseMutation
      argument :id, ID, required: true

      field :part_option, Types::PartOptionType, null: true
      field :errors, [String], null: true

      def resolve(id:)
        part_option = PartOption.find(id)

        if part_option.destroy
          {
            part_option: part_option,
            errors: []
          }
        else
          {
            errors: part_option.errors.full_messages,
            part_option: nil
          }
        end
      end
    end
  end
end