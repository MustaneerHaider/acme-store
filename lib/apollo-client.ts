import { ApolloClient, InMemoryCache } from '@apollo/client'

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: `${process.env.BASE_URL}/api/graphql`,
})

export default client
