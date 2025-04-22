"use client";

import React, { useEffect } from "react";
// import { getServerSession } from "next-auth";
// import { authOptions } from "../../lib/auth";
import { useRouter } from "next/navigation";

import Sidebar from "../../_components/admin/Sidebar";
import Header from "../../_components/admin/Header";
// import { db } from "../../../database/drizzle";
// import { users } from "../../../database/schema";
// import { eq } from "drizzle-orm";
import { useSelector } from "react-redux";

const Layout = ({ children }) => {
  // try {
  //   //  Get session
  //   const session = await getServerSession(authOptions);

  //   // Redirect if session is missing
  //   if (!session?.user?.id) {
  //     return redirect("/sign-in");
  //   }

  //   //  Fetch user role from the database using email instead of ID
  //   const user = await db
  //     .select({ role: users.role })
  //     .from(users)
  //     .where(eq(users.email, session.user.email)) // Use email instead of session.user.id
  //     .limit(1)
  //     .then((res) => res[0]);

  //   // Redirect if user is not an admin
  //   if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
  //     console.error("Unauthorized access - User Email:", session.user.email);
  //     return redirect("/");
  //   }

  const { isAuthenticated } = useSelector((state) => state.auth);
  const router = useRouter();
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/sign-in");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;
  return (
    <main className="flex h-screen w-full">
      <Sidebar />
      <div className="flex flex-col w-full">
        <Header />
        <div className="flex-1  overflow-y-scroll">{children}</div>
      </div>
    </main>
  );
  // } catch (error) {
  //   console.error("Error in Layout:", error);
  //   return redirect("/sign-in");
  // }
};

export default Layout;
