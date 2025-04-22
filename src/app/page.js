"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/customer/home");
  }, [router]);

  return null; // Optionally, you can show a loader here
};

export default Home;
