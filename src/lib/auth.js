import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "../../database/drizzle";
import { users, accounts } from "../../database/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET, // Ensure this is set in your environment
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    CredentialsProvider({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password are required.");
          }

          const [existingUser] = await db
            .select()
            .from(users)
            .where(eq(users.email, credentials.email))
            .limit(1);

          if (!existingUser) {
            throw new Error("User not found.");
          }

          if (!existingUser.passwordHash) {
            throw new Error("Password authentication is not available for this account.");
          }

          const passwordMatch = await bcrypt.compare(credentials.password, existingUser.passwordHash);
          if (!passwordMatch) {
            throw new Error("Incorrect password.");
          }

          return {
            id: existingUser.id,
            email: existingUser.email,
            name: existingUser.fullName,
            role: existingUser.role,
          };
        } catch (error) {
          console.error("Login Error:", error.message);
          throw new Error("Invalid credentials.");
        }
      },
    }),
  ],

  pages: {
    signIn: "/sign-in",
  },

  callbacks: {
    async signIn({ account, profile }) {
      try {
        if (account?.provider === "google") {
          if (!profile?.email || !profile?.email_verified) {
            console.error("Email not verified or missing.");
            return false;
          }

          let [existingUser] = await db
            .select()
            .from(users)
            .where(eq(users.email, profile.email))
            .limit(1);

          if (!existingUser) {
            const [insertedUser] = await db
              .insert(users)
              .values({
                id: uuidv4(),
                fullName: profile.name,
                email: profile.email,
                role: "USER",
                passwordHash: null,
              })
              .returning({
                id: users.id,
                fullName: users.fullName,
                email: users.email,
                role: users.role,
              });

            existingUser = insertedUser;
          }

          const userId = existingUser.id;

          const [existingAccount] = await db
            .select()
            .from(accounts)
            .where(eq(accounts.providerAccountId, account.id))
            .limit(1);

          if (!existingAccount) {
            await db.insert(accounts).values({
              userId,
              provider: account.provider,
              providerAccountId: account.id,
            });
          }

          return true;
        }

        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role; // Include role in JWT
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.role = token.role; // Include role in session
      }
      return session;
    },
  },
};

// Ensure the correct export based on your Next.js version
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };