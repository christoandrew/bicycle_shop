import { gql } from "@apollo/client";

export const GET_PART_CATEGORIES = gql`
  query GetPartCategories {
    partCategories {
      id
      name
      position
      active
      required
      productType {
        id
        name
      }
    }
  }
`;
export const GET_PART_CATEGORY = gql`
  query GetPartCategory($id: ID!) {
    partCategory(id: $id) {
      id
      name
      position
      active
      productType {
        id
        name
      }
    }
  }
`;

export const GET_PART_CATEGORIES_BY_PRODUCT_TYPE_CODE = gql`
  query GetPartCategoriesByProductTypeCode($productTypeCode: String!) {
    partCategoriesByProductTypeCode(productTypeCode: $productTypeCode) {
      id
      name
      position
      active
      required
      productType {
        id
        name
      }
      partOptions {
        id
        name
        price
        inStock
      }
    }
  }
`;

export const GET_PART_CATEGORIES_BY_PRODUCT_TYPE_ID = gql`
  query GetPartCategoriesByProductTypeId($productTypeId: ID!) {
    partCategoriesByProductTypeId(productTypeId: $productTypeId) {
      id
      name
      position
      active
      required
      productType {
        id
        name
      }
      partOptions {
        id
        name
        price
        inStock
      }
    }
  }
`;
