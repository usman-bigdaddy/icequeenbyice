"use client"; // Ensure this runs on the client

import { SessionProvider } from "next-auth/react";

export default function RootLayout({ children }) {
  return <>{children}</>;
}
