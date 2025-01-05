import { gql } from "@apollo/client";
export const DELETE_PRODUCT_TYPE = gql`
  mutation DeleteProductType($id: ID!) {
    deleteProductType(id: $id) {
      errors
    }
  }
`;
export const CREATE_PRODUCT_TYPE = gql`
  mutation CreateProductType($input: CreateProductTypeDefinitionInput!) {
    createProductType(input: $input) {
      productType {
        id
        name
        active
        description
        code
      }
      errors
    }
  }
`;
export const UPDATE_PRODUCT_TYPE = gql`
  mutation UpdateProductType($input: UpdateProductTypeDefinitionInput!) {
    updateProductType(input: $input) {
      productType {
        id
        name
        active
        description
        code
      }
      errors
    }
  }
`;
