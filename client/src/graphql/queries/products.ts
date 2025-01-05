import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      basePrice
      description
      preconfigured
      active
      productType {
        id
        name
      }
    }
  }
`;

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
      active
      preconfigured
      description
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

export const GET_PRODUCT_BY_ID = gql`
  query GetProductById($id: ID!) {
    product(id: $id) {
      id
      name
      productType {
        id
        name
      }
      basePrice
      productSelections {
        id
        partOption {
          id
          name
          partCategory {
            id
            name
          }
        }
      }
    }
  }
`;

export const GET_PRODUCTS_BY_TYPE = gql`
  query GetProductsByType($productType: String!) {
    productsByType(productType: $productType) {
      id
      name
      productType {
        id
        name
      }
      basePrice
    }
  }
`;
