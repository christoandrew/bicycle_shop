import { gql } from "@apollo/client";

export const CREATE_PART_CATEGORY = gql`
  mutation CreatePartCategory($input: CreatePartCategoryInput!) {
    createPartCategory(input: $input) {
      partCategory {
        name
        position
        active
        required
        productTypeId
      }
    }
  }
`;

export const UPDATE_PART_CATEGORY = gql`
  mutation UpdatePartCategory($input: UpdatePartCategoryInput!) {
    updatePartCategory(input: $input) {
      partCategory {
        name
        position
        active
        required
        productTypeId
      }
    }
  }
`;

export const DELETE_PART_CATEGORY = gql`
  mutation DeletePartCategory($id: ID!) {
    deletePartCategory(id: $id) {
      errors
    }
  }
`;
