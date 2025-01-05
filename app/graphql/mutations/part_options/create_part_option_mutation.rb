module Mutations
  module PartOptions
    class CreatePartOptionMutation < BaseMutation
      argument :input, Inputs::CreatePartOptionInput, required: true

      field :part_option, Types::PartOptionType, null: true
      field :errors, [String], null: true

      def resolve(input:)
        part_option = PartOption.new(input.to_h)

        if part_option.save
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