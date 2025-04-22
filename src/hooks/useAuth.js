import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function useAuth() {
  const { data: session, status } = useSession({
    required: true, // ✅ Ensures session is only fetched when needed
  });

  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    console.log("🔹 Session Data:", session);
    console.log("🔹 User Role:", session?.user?.role);
    console.log("🔹 Status:", status);
  }, [session, status]);

  return { session, status };
}
