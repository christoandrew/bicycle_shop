import { gql } from "@apollo/client";

export const GET_PART_OPTIONS = gql`
  query GetPartOptions {
    partOptions {
      id
      name
      price
      inStock
      position
      stockQuantity
      partCategory {
        id
        name
        productType {
          id
          name
        }
      }
    }
  }
`;

export const GET_PART_OPTION = gql`
  query GetPartOption($id: ID!) {
    partOption(id: $id) {
      id
      name
      price
      inStock
      stockQuantity
      partCategory {
        id
        name
        productType {
          id
          name
        }
      }
    }
  }
`;

export const GET_PART_OPTIONS_BY_PART_CATEGORY_ID = gql`
  query GetPartOptionsByPartCategoryId($partCategoryId: ID!) {
    partOptionsByPartCategoryId(partCategoryId: $partCategoryId) {
      id
      name
      price
      inStock
      stockQuantity
      partCategory {
        id
        name
        productType {
          id
          name
        }
      }
    }
  }
`;
