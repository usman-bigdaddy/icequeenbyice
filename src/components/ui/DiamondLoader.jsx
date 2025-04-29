"use client";
import diamond from "@/assets/diamond.png";
import Image from "next/image";

export default function DiamondLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50 relative">
      {/* Background blur */}
      <div className="absolute inset-0 bg-gray-200 opacity-50 backdrop-blur-lg"></div>

      <div className="animate-pulse flex flex-col items-center relative z-10">
        <Image width={120} src={diamond} alt="Loading" className="mb-4" />
        <p className="text-gray-600">Please wait ...</p>
      </div>
    </div>
  );
}
