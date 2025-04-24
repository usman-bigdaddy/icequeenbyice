"use client";
import React from "react";
import { IoIosArrowForward } from "react-icons/io";
import { Button } from "@/components/ui/button";
import useInView from "@/hooks/useInView";
import { SparklesCore } from "./sparkles";
import Link from "next/link";

const TextSection = () => {
  const { ref: textRef, isVisible: showText } = useInView();

  return (
    <div className="relative bg-[#F9689F] w-full px-4 sm:px-6 md:px-12 lg:px-20 xl:px-40 2xl:px-60 py-12 md:py-24 min-h-[500px] md:min-h-[600px]">
      {/* Sparkles Background */}
      <div className="w-full absolute inset-0 h-full z-0 overflow-hidden">
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

      {/* Content Container */}
      <div
        ref={textRef}
        className={`relative z-10 max-w-7xl mx-auto transition-all duration-1000 ease-in-out ${
          showText ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="flex flex-col lg:flex-row gap-10 xl:gap-16 items-center">
          {/* Left Column - Headline and CTA */}
          <div className="w-full lg:w-1/2 flex flex-col gap-6 md:gap-8">
            <div className="space-y-2 md:space-y-3">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white leading-tight tracking-tight">
                Have a Look at Our Unique
                <br />
                Selling Perspective
              </h2>
              <p className="text-white/90 text-base md:text-lg font-light max-w-lg">
                Discover our carefully curated collection of fashion essentials
                designed for the modern individual.
              </p>
            </div>

            <Link href="/customer/product" className="w-fit">
              <Button className="group mt-2 py-4 px-8 md:py-5 md:px-10 inline-flex items-center gap-3 rounded-xl bg-black/80 hover:bg-black text-white text-base md:text-lg font-medium transition-all duration-300 hover:gap-4 hover:scale-[1.02] active:scale-95">
                <span>Explore our Collections</span>
                <IoIosArrowForward className="transition-all duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          {/* Right Column - Stats and Descriptions */}
          <div className="w-full lg:w-1/2 flex flex-col gap-8 md:gap-10">
            <p className="text-white/90 text-base md:text-lg font-light leading-relaxed">
              Our garments blend timeless style with contemporary trends,
              ensuring you'll find pieces that express your unique personality
              and stand the test of time.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
              <div className="flex flex-col gap-3 md:gap-4">
                <h3 className="text-4xl md:text-5xl text-white font-bold">
                  99%
                </h3>
                <p className="text-white/90 text-sm md:text-base font-light leading-relaxed">
                  of our customers report finding their perfect style match
                  within our diverse collections. Our commitment to inclusive
                  sizing and versatile designs means there's something for
                  everyone.
                </p>
              </div>

              <div className="flex flex-col gap-3 md:gap-4">
                <h3 className="text-4xl md:text-5xl text-white font-bold">
                  100%
                </h3>
                <p className="text-white/90 text-sm md:text-base font-light leading-relaxed">
                  sustainable materials used across our premium collections. We
                  believe fashion can be both beautiful and responsible, which
                  is why we partner with ethical suppliers worldwide.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextSection;
