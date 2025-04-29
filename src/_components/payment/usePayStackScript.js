"use client";
import { useEffect, useState } from "react";

const usePaystackScript = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const existingScript = document.getElementById("paystack-script");

    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://js.paystack.co/v1/inline.js";
      script.id = "paystack-script";
      script.async = true;

      script.onload = () => {
        setLoaded(true);
      };

      script.onerror = () => {
        console.error("Failed to load Paystack.");
      };

      document.body.appendChild(script);
    } else {
      setLoaded(true);
    }
  }, []);

  return loaded;
};

export default usePaystackScript;
