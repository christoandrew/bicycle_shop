import { gql } from "@apollo/client";
export const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: CreateProductDefinitionInput!) {
    createProduct(input: $input) {
      product {
        id
        name
        basePrice
        productType {
          id
        }
        description
        active
      }
      errors
    }
  }
`;
export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id) {
      errors
    }
  }
`;
export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($input: UpdateProductDefinitionInput!) {
    updateProduct(input: $input) {
      product {
        id
        name
        basePrice
        productType {
          id
        }
        description
        active
      }
      errors
    }
  }
`;
