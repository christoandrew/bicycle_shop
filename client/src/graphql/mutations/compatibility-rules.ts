import { gql } from "@apollo/client";

export const CREATE_COMPATIBILITY_RULE = gql`
  mutation CreateCompatibilityRule($input: CreateCompatibilityRuleInput!) {
    createCompatibilityRule(input: $input) {
      compatibilityRule {
        id
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
      errors
    }
  }
`;

export const UPDATE_COMPATIBILITY_RULE = gql`
  mutation UpdateCompatibilityRule($input: UpdateCompatibilityRuleInput!) {
    updateCompatibilityRule(input: $input) {
      compatibilityRule {
        id
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
      errors
    }
  }
`;

export const DELETE_COMPATIBILITY_RULE = gql`
  mutation DeleteCompatibilityRule($id: ID!) {
    deleteCompatibilityRule(id: $id) {
      errors
    }
  }
`;
