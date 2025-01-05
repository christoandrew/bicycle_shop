class Schema < GraphQL::Schema
  query(Types::QueryType)
  mutation(Types::MutationType)
end