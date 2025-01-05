import { gql } from "@apollo/client";

export const CHECKOUT = gql`
  mutation CheckoutCart($sessionId: String!) {
    checkoutCart(sessionId: $sessionId) {
      errors
    }
  }
`;
