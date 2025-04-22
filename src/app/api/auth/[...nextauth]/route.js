import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "../../../../../database/drizzle";
import { users, accounts } from "../../../../../database/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

// ✅ Validate environment variables early
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.NEXTAUTH_SECRET) {
  throw new Error("Missing required authentication environment variables");
}

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  cookies: {
    sessionToken: {
      name: "__Secure-authjs.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          console.log("🔹 Credentials:", credentials);

          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password are required.");
          }

          const [user] = await db
            .select()
            .from(users)
            .where(eq(users.email, credentials.email))
            .limit(1);

          if (!user) {
            throw new Error("User not found.");
          }

          if (!user.passwordHash) {
            throw new Error("Password authentication is not available for this account.");
          }

          const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
          if (!isValid) {
            throw new Error("Incorrect password.");
          }

          return {
            id: user.id,
            email: user.email,
            name: user.fullName,
            role: user.role, // ✅ Ensure role is passed
          };
        } catch (error) {
          console.error("🔹 Authentication error:", error.message);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
    error: "/auth-error",
  },
  callbacks: {
    async signIn({ account, profile }) {
      try {
        if (account?.provider === "google") {
          if (!profile?.email_verified || !profile?.email) {
            console.error("🔹 Email not verified or missing.");
            return false;
          }

          let [existingUser] = await db
            .select()
            .from(users)
            .where(eq(users.email, profile.email))
            .limit(1);

          if (!existingUser) {
            const insertedUser = await db
              .insert(users)
              .values({
                id: uuidv4(),
                fullName: profile.name,
                email: profile.email,
                role: "USER", // Default role for new users
                passwordHash: null,
              })
              .returning({
                id: users.id,
                fullName: users.fullName,
                email: users.email,
                role: users.role,
              });

            existingUser = insertedUser[0]; // Ensure we get the newly created user
          }

          // ✅ Ensure the role is always retrieved correctly
          const { id, fullName, email, role } = existingUser;

          account.user = { id, name: fullName, email, role };
        }

        return true;
      } catch (error) {
        console.error("🔹 Sign-in error:", error.message);
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
      }

      // ✅ Fetch role from database if it's missing (for social logins)
      if (!token.role && token.email) {
        try {
          const [existingUser] = await db
            .select({ role: users.role })
            .from(users)
            .where(eq(users.email, token.email))
            .limit(1);

          if (existingUser) {
            token.role = existingUser.role;
          }
        } catch (error) {
          console.error("🔹 Error fetching role from database:", error.message);
        }
      }

      console.log("🔹 JWT Token Debug:", token);
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.role = token.role; // ✅ Ensure role is available in session
      }

      console.log("🔹 Session Debug:", session);
      return session;
    },
  },
  events: {
    async deleteUser({ user }) {
      await db.delete(accounts).where(eq(accounts.userId, user.id));
    },
  },
  logger: {
    error(code, metadata) {
      console.error({ type: "auth-error", code, metadata });
    },
    warn(code) {
      console.warn({ type: "auth-warn", code });
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
