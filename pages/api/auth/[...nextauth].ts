import NextAuth from 'next-auth'
import CredentialsPovider from 'next-auth/providers/credentials'
import connectToDB from '../../../lib/db'
import { verifyPassword } from '../../../lib/helpers'
import User from '../../../models/user'

connectToDB()

export default NextAuth({
  providers: [
    CredentialsPovider({
      credentials: {
        email: {
          type: 'email',
        },
        password: {
          type: 'password',
        },
      },
      async authorize(credentials) {
        const user = await User.findOne({ email: credentials!.email })
        if (!user) {
          throw new Error('Invalid email or password.')
        }

        const isEqual = await verifyPassword(
          credentials!.password,
          user.password
        )
        if (!isEqual) {
          throw new Error('Invalid email or password.')
        }

        return { email: user.email }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  secret: process.env.JWT_SECRET,
  callbacks: {
    async session({ session }) {
      const user = await User.findOne({ email: session.user.email })
      session.user.id = user.id.toString()
      session.user.isAdmin = user.isAdmin
      return session
    },
  },
})
