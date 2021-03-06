import { ApolloServer } from 'apollo-server-micro'
import Cors from 'micro-cors'

import resolvers from '../../graphql/resolvers'
import typeDefs from '../../graphql/type-defs'

const cors = Cors()

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: process.env.NODE_ENV !== 'production',
})

const startServer = server.start()

export default cors(async (req: any, res: any) => {
  if (req.method === 'OPTIONS') {
    res.end()
    return false
  }

  await startServer
  await server.createHandler({ path: '/api/graphql' })(req, res)
})

export const config = {
  api: {
    bodyParser: false,
  },
}
