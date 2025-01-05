module Mutations
  module PartOptions
    class UpdatePartOptionMutation < BaseMutation
      argument :input, Inputs::UpdatePartOptionInput, required: true

      field :part_option, Types::PartOptionType, null: true
      field :errors, [String], null: true

      def resolve(input:)
        part_option = PartOption.find(input[:id])

        if part_option.update(input.to_h)
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