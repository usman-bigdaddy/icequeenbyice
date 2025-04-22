"use client";
import React from "react";
import { IoIosArrowForward } from "react-icons/io";
import { Button } from "@/components/ui/button";
import useInView from "@/hooks/useInView";
import { SparklesCore } from "./sparkles";

const TextSection = () => {
  const { ref: textRef, isVisible: showText } = useInView();
  return (
    <div className="relative bg-[#F9689F] w-full px-5 md:px-40 2xl:px-80 md:min-h-[600px] py-10 md:pt-30 md:pb-20 ">
      <div className="w-full absolute inset-0 h-full z-0">
        <SparklesCore
          id="tsparticles"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={200}
          className="w-full h-full pointer-events-none"
          particleColor="#FFFFFF"
        />
      </div>
      <div
        ref={textRef}
        className={`w-full flex flex-col-reverse md:flex-row justify-center items-center  transition-all duration-1000 ease-in-out z-10 ${showText ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <div className="flex flex-col w-full md:w-1/2 md:gap-6 items-center md:items-start">
          <div className="flex flex-col ">
            <p className="text-[22px] md:text-[30px] font-medium text-white">
              Have a Look at Our Unique{" "}
            </p>
            <p className="text-[22px] md:text-[30px] font-medium text-white">
              Selling Perspective
            </p>
          </div>
          <Button className="mt-2 py-6 px-10 inline-flex gap2 rounded-2xl bg-black/70 text-white text-md font-medium hover:cursor-pointer hover:animate-pulse">
            <span>See Our Products</span> <IoIosArrowForward />
          </Button>
        </div>
        <div className="flex flex-col w-full md:w-1/2 gap-10">
          <div className="w-full">
            <p className="text-[16px] font-extralight text-white sm:text-center">
              Discover our carefully curated collection of fashion essentials
              designed for the modern individual. Our garments blend timeless
              style with contemporary trends, ensuring you'll find pieces that
              express your unique personality and stand the test of time
            </p>
          </div>
          <div className="flex flex-col md:flex-row justify-between gap-10 items-center mb-3">
            <div className="flex flex-col gap-3">
              <h2 className="text-4xl text-white font-bold">99%</h2>
              <p className="text-[16px] font-extralight text-white ">
                of our customers report finding their perfect style match within
                our diverse collections. Our commitment to inclusive sizing and
                versatile designs means there's something for everyone
              </p>
            </div>

            <div className="flex flex-col gap-3 ">
              <h2 className="text-4xl text-white font-bold">100%</h2>
              <p className="text-[16px] font-light text-white ">
                sustainable materials used across our premium collections. We
                believe fashion can be both beautiful and responsible, which is
                why we partner with ethical suppliers worldwide.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextSection;
