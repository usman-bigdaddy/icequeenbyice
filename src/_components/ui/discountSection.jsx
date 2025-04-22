"use client";
import Link from "next/link";
import img1 from "@/assets/501.png";
import img2 from "@/assets/502.png";
import Image from "next/image";
import { SparklesCore } from "./sparkles";
import useInView from "@/hooks/useInView";

const DiscountSection = () => {
  const { ref: disCountRef, isVisible: showDiscount } = useInView();
  return (
    <div className="relative w-full flex flex-col justify-center items-center bg-[#FAC9E4] px-4 md:px-40 py-5 md:h-[360px] ">
      <div
        ref={disCountRef}
        className={`w-full h-full flex flex-col justify-center items-center transition-all duration-1000 ease-in-out z-10 ${
          showDiscount ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className="flex flex-col items-center z-10 text-center">
          <h1 className="text-2xl md:text-4xl font-semibold text-black mb-2">
            Get 50% Off
          </h1>
          <p className="text-sm font-medium text-gray-700">
            for all new product purchases
          </p>
          <p className="text-sm font-medium text-gray-700">
            min. purchase Above N350,000
          </p>
          <Link
            href="#"
            className="bg-white text-gray-700 shadow-md px-4 py-2 rounded-3xl text-md font-medium mt-4 md:mt-7"
          >
            Shop Now
          </Link>
        </div>

        <div className="hidden md:block absolute left-0 bottom-0 z-10">
          <Image
            src={img1}
            alt="promo"
            className="w-[320px] h-[350px] object-contain"
          />
        </div>
        <div className="hidden md:block absolute right-0 bottom-0 z-10">
          <Image
            src={img2}
            alt="promo"
            className="w-[320px] h-[350px] object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default DiscountSection;
