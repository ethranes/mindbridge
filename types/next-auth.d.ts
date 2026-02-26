import "next-auth"
import "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      username: string
      subscriptionTier: string
    }
  }

  interface User {
    id: string
    email: string
    name: string
    username: string
    subscriptionTier: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    username: string
    subscriptionTier: string
  }
}
