import { ApolloClient, InMemoryCache } from "@apollo/client";
export function client() {
  return new ApolloClient({
    uri: "/graphql",
    cache: new InMemoryCache(),
  });
}
