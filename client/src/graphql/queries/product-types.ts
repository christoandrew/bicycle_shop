import { gql } from "@apollo/client";

export const GET_PRODUCT_TYPES = gql`
  query GetProductTypes($active: Boolean) {
    productTypes(active: $active) {
      id
      name
      active
      description
      code
    }
  }
`;
