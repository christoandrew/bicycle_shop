import { gql } from "@apollo/client";

export const CREATE_PART_OPTION = gql`
  mutation CreatePartOption($input: CreatePartOptionInput!) {
    createPartOption(input: $input) {
      partOption {
        name
        price
        inStock
        stockQuantity
        partCategoryId
        position
      }
    }
  }
`;

export const UPDATE_PART_OPTION = gql`
  mutation UpdatePartOption($input: UpdatePartOptionInput!) {
    updatePartOption(input: $input) {
      partOption {
        id
        name
        price
        inStock
        stockQuantity
        partCategoryId
        position
      }
    }
  }
`;

export const DELETE_PART_OPTION = gql`
  mutation DeletePartOption($id: ID!) {
    deletePartOption(id: $id) {
      errors
    }
  }
`;
