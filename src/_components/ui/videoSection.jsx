"use client";
import React from "react";
import Image from "next/image";
import dp from "@/assets/icequeen.jpg";
import { PiTimerFill } from "react-icons/pi";
import cart2 from "@/assets/cart2.png";
import subsImg from "@/assets/subsImage.png";
import useInView from "@/hooks/useInView";

const VideoSection = () => {
  const { ref: headerRef, isVisible: showHeader } = useInView();
  const { ref: videoRef, isVisible: showVideo } = useInView();
  const { ref: text, isVisible: showTextContent } = useInView();
  const { ref: subs, isVisible: showSubs } = useInView();
  return (
    <div className="relative w-full flex flex-col md:pt-10 lg:px-40 2xl:px-80 px-4 pb-20">
      <div className="absolute inset-0 bg-[url('/diamondsbg.svg')] bg-cover opacity-40 z-0" />

      <div className="flex flex-col items-start z-10">
        <div
          ref={headerRef}
          className={`transition-all duration-1000 ease-in-out ${showHeader ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <h2 className="text-2xl md:text-3xl font-semibold text-black">
            Kaftan: Radiant Floral Design
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 mt-5 mb-7">
            <Image
              src={dp}
              alt="owner-pic"
              className="w-14 h-14 rounded-full"
            />

            <div className="flex flex-row items-center gap-2 border-r sm:px-4 border-r-gray-400">
              <div className="flex flex-col items-start">
                <p className="text-sm font-semibold text-black">
                  Designed By Ice
                </p>
                <p className="text-xs font-light text-black">15 March 2025</p>
              </div>
            </div>

            <div className="flex flex-row items-center gap-2 border-r sm:px-4 border-r-gray-400">
              <PiTimerFill className="w-6 h-6" />
              <div className="flex flex-col items-start">
                <p className="text-sm font-medium text-black">Prep Time</p>
                <p className="text-xs font-light text-gray-700">Consultation</p>
              </div>
            </div>

            <div className="flex flex-row items-center gap-2 sm:px-4">
              <PiTimerFill className="w-6 h-6" />
              <div className="flex flex-col items-start">
                <p className="text-sm font-medium text-black">Payments</p>
                <p className="text-xs font-light text-gray-700">Bookings</p>
              </div>
            </div>
          </div>
        </div>

        <div
          ref={videoRef}
          className={`flex flex-col md:flex-row items-center w-full gap-6 mt-6 transition-all duration-1000 ease-in-out ${showVideo ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="w-full md:w-[65%]">
            <iframe
              width="100%"
              height="250"
              className="rounded-2xl md:h-[400px]"
              src="https://www.youtube.com/embed/EN6jtHIqeTg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          <div
            className="w-full md:w-[35%] h-auto md:h-[400px] rounded-2xl py-5 px-6 flex flex-col items-center"
            style={{ background: "rgba(255, 182, 193, 0.5)" }}
          >
            <h2 className="text-lg md:text-xl font-semibold text-black mb-4 text-center">
              Transform to Garment Details
            </h2>

            {[
              ["Fabric Composition", "100% Cotton"],
              ["Size", "XL (UK 22-24)"],
              ["Color Variations", "Base Color: Black"],
              ["Material Weight", "180 GSM"],
              ["Care Instructions", "Hand wash"],
            ].map(([label, value], i) => (
              <div
                key={i}
                className="flex justify-between w-full py-2 border-b border-gray-400"
              >
                <p className="text-sm text-black/80 font-light">{label}</p>
                <p className="text-sm text-black font-semibold">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div
          ref={subs}
          className={`w-full mt-10 md:mt-20 rounded-[40px] relative bg-[#FDE7F2] transition-all duration-1000 ease-in-out z-10 ${
            showSubs ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex flex-col items-center text-center px-4 pt-10 md:pt-20 md:px-30">
            <h2 className="text-2xl md:text-4xl font-semibold text-black mb-3">
              Style delivered to your doorstep
            </h2>
            <p className="text-sm md:text-base text-gray-700 font-light">
              Subscribe to our newsletter for exclusive deals, fashion tips,
            </p>
            <p className="text-sm md:text-base text-gray-700 font-light">
              and first access to our latest collections
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 mt-6 px-4 md:pl-20 sm:py-4">
            <Image
              src={cart2}
              alt="cart"
              className="w-10 h-10 md:w-14 md:h-14"
            />
            <div className="flex w-full max-w-md gap-2 bg-white rounded-2xl px-4 py-3">
              <input
                type="email"
                className="flex-1 bg-transparent p-2 text-sm focus:outline-none"
                placeholder="Enter your email..."
              />
              <button className="bg-black text-white text-sm px-4 py-2 rounded-2xl hover:animate-pulse">
                Subscribe
              </button>
            </div>
          </div>

          <div className="absolute right-0 bottom-0 z-0 hidden md:block">
            <Image
              src={subsImg}
              alt="product"
              className="w-[250px] h-[300px] object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoSection;
