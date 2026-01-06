import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import apiClient from "@/lib/api-client"

export const authOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required")
        }

        try {
          const response = await apiClient.post("/users/login", {
            email: credentials.email,
            password: credentials.password,
          })

          const { data } = response.data

          // ✅ Must have token
          if (!data?.accessToken) {
            throw new Error("Invalid login response")
          }

          // ✅ Admin-only gate here (BEST place)
          if (data.role !== "admin") {
            throw new Error("Access denied: Admins only.")
          }

          return {
            id: data._id,
            email: data.email,
            role: data.role,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          }
        } catch (err: any) {
          // ✅ Make sure we always throw a readable message for signIn() -> result.error
          const msg =
            err?.response?.data?.message ||
            err?.message ||
            "Invalid email or password"
          throw new Error(msg)
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
        token.role = user.role
        token.id = user.id
      }
      return token
    },

    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        // custom fields
        session.accessToken = token.accessToken as string
        session.refreshToken = token.refreshToken as string
      }
      return session
    },
  },

  pages: {
    signIn: "/auth/login",
  },

  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
