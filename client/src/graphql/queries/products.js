import { gql } from "@apollo/client";
export const GET_PRECONFIGURED_PRODUCTS = gql`
  query GetPreconfiguredProducts($productType: String!) {
    preconfiguredProducts(productType: $productType) {
      id
      name
      productType {
        id
        name
        code
      }
      basePrice
      description
      active
    }
  }
`;
export const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      name
      productType {
        id
        name
        code
      }
      basePrice
      active
      preconfigured
      description
    }
  }
`;
