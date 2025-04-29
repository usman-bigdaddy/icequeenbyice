"use server";

import { eq } from "drizzle-orm";
import { db } from "../../database/drizzle";
import { users, accounts } from "../../database/schema";
import { signIn } from "next-auth/react"; // Client-side only
import { auth } from "../../auth"; // Ensure proper auth import
import { getServerSession } from "next-auth"; // Fetch server-side session

export const signInWithGoogle = async () => {
  try {
    //  Start sign-in (must be done on client-side)
    const result = await signIn("google", { redirect: false });

    if (!result || result.error) {
      return { success: false, error: result?.error || "Google sign-in failed" };
    }

    //  Fetch session data (server-side)
    const session = await getServerSession(auth);
    if (!session?.user?.email) {
      return { success: false, error: "No user data received" };
    }

    //  Check if user exists
    let existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, session.user.email))
      .limit(1)
      .then((res) => res[0] || null);

    if (!existingUser) {
      //  Insert new user
      [existingUser] = await db
        .insert(users)
        .values({
          fullName: session.user.name,
          email: session.user.email,
          provider: "google",
          image: session.user.image, //  Store profile picture
        })
        .returning({ id: users.id });

      //  Insert into accounts table (for social login tracking)
      await db.insert(accounts).values({
        userId: existingUser.id, // Correct user ID
        provider: "google",
        providerAccountId: session.user.email, // Should ideally use Google's unique ID
      });
    } else {
      //  Update profile picture in case it changes
      await db
        .update(users)
        .set({ image: session.user.image })
        .where(eq(users.email, session.user.email));
    }

    return { success: true };
  } catch (error) {
    console.error("❌ Google Sign-In Error:", error);
    return { success: false, error: "Google Sign-In Error" };
  }
};
