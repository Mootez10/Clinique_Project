import NextAuth from "next-auth"

declare module "next-auth" {
  interface User {
    email: string
    role: string
    tenantId: string
    token: string
  }

  interface Session {
    user: User
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    email: string
    role: string
    tenantId: string
    token: string
  }
}
