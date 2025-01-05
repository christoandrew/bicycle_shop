import { gql } from "@apollo/client";

export const CREATE_PRICE_RULE = gql`
  mutation CreatePriceRule($input: CreatePriceRuleInput!) {
    createPriceRule(input: $input) {
      priceRule {
        id
        active
        description
      }
    }
  }
`;

export const UPDATE_PRICE_RULE = gql`
  mutation UpdatePriceRule($input: UpdatePriceRuleInput!) {
    updatePriceRule(input: $input) {
      priceRule {
        id
        active
        description
      }
    }
  }
`;

export const DELETE_PRICE_RULE = gql`
  mutation DeletePriceRule($id: ID!) {
    deletePriceRule(id: $id) {
      errors
    }
  }
`;
