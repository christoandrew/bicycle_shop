import { gql } from "@apollo/client";

export const GET_PRICE_RULES = gql`
  query GetPriceRules {
    priceRules {
      id
      active
      description
      priceRuleAppliesTo
      price
    }
  }
`;

export const GET_PRICE_RULES_FOR_PRODUCT_TYPE = gql`
  query GetPriceRulesForProductType($productTypeId: ID!) {
    priceRulesForProductType(productTypeId: $productTypeId) {
      id
      active
      description
      partOptions {
        id
        name
        price
      }
      price
    }
  }
`;
