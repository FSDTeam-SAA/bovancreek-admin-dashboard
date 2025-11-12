import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import apiClient from "@/lib/api-client";

const authOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const response = await apiClient.post("/users/login", {
            email: credentials.email,
            password: credentials.password,
          });

          const { data } = response.data;

          console.log(data)

          if (data?.accessToken) {
            return {
              id: data._id,
              email: data.email,
              role: data.role,
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
            };
          }
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        // @ts-ignore - custom props on session
        session.accessToken = token.accessToken as string;
        // @ts-ignore
        session.refreshToken = token.refreshToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};

// ✅ Return a single handler function
const handler = NextAuth(authOptions);

// Export for route handlers (no destructuring of handlers)
export { handler as GET, handler as POST };

// Optional: if you also need auth()/signIn()/signOut() helpers (v5 only),
// you can create a separate `src/auth.ts` that calls NextAuth again and exports those.
// (Keep the route using the handler pattern to stay compatible.)
