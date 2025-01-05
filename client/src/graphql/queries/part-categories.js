import { gql } from "@apollo/client";
export const GET_PART_CATEGORIES = gql`
  query GetPartCategories {
    partCategories {
      id
      name
      position
      active
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
export const GET_PART_CATEGORIES_BY_PRODUCT_TYPE = gql`
  query GetPartCategoriesByProductType($productType: String!) {
    partCategoriesByProductType(productType: $productType) {
      id
      name
      position
      active
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
