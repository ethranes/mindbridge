import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { prisma } from "@/lib/db"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email as string
            }
          })

          if (!user) {
            return null
          }

          const isPasswordValid = await compare(
            credentials.password as string,
            user.passwordHash
          )

          if (!isPasswordValid) {
            return null
          }

          // Return user - NextAuth will automatically set token.sub to user.id
          return {
            id: user.id,
            email: user.email,
            name: user.username,
            username: user.username,
            subscriptionTier: user.subscriptionTier
          }
        } catch (error) {
          console.error("Error in authorize:", error)
          return null
        }
      }
    })
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      // On sign in, add custom properties to token
      if (user) {
        token.username = (user as any).username
        token.subscriptionTier = (user as any).subscriptionTier
      }
      return token
    },
    async session({ session, token }) {
      // Add custom properties to session from token
      if (session.user) {
        // Use token.sub for the user ID (standard JWT claim)
        session.user.id = token.sub as string
        session.user.username = token.username as string
        session.user.subscriptionTier = token.subscriptionTier as string
      }
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
})
