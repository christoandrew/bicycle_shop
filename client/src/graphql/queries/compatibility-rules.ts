import { gql } from "@apollo/client";

export const GET_COMPATIBILITY_RULES = gql`
  query GetCompatibilityRules {
    compatibilityRules {
      id
      active
      productType {
        id
        name
      }
      ruleType
      requiringOption {
        id
        name
      }
      requiredOption {
        id
        name
      }
    }
  }
`;

export const GET_COMPATIBILITY_RULES_FOR_PRODUCT_TYPE = gql`
  query GetCompatibilityRulesForProductType($productTypeId: ID!) {
    compatibilityRulesForProductType(productTypeId: $productTypeId) {
      id
      active
      productType {
        id
        name
      }
      ruleType
      requiringOption {
        id
        name
      }
      requiredOption {
        id
        name
      }
    }
  }
`;
