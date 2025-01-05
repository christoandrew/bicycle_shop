import { gql } from "@apollo/client";

export const GET_CART = gql`
  query GetCart($sessionId: String!) {
    cart(sessionId: $sessionId) {
      id
      totalPrice
      cartItems {
        id
        totalPrice
        product {
          name
          productType {
            name
          }
        }
        partOptions {
          id
          name
          price
          partCategory {
            id
            name
            productType {
              id
              name
            }
          }
        }
        quantity
      }
    }
  }
`;

export const ORDERS = gql`
  query Orders($sessionId: String) {
    orders(sessionId: $sessionId) {
      id
      totalPrice
      cartItems {
        id
        totalPrice
        product {
          name
          productType {
            name
          }
        }
        partOptions {
          id
          name
          price
          partCategory {
            id
            name
            productType {
              id
              name
            }
          }
        }
        quantity
      }
    }
  }
`;
