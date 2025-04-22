"use client";
import React from "react";
import Image from "next/image";
import { CiCirclePlus } from "react-icons/ci";
import useInView from "@/hooks/useInView";

const SuggestedProducts = ({ bg, style }) => {
  const { ref: suggestRef, isVisible: showSuggested } = useInView();

  const randomProducts = carouselItems
    .filter((item) => item.title !== "fr")
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);
  return (
    <div className={`relative md:px-40 md:pb-20 md:pt-10 ${style}`}>
      {!bg && (
        <div className="absolute inset-0 bg-[url('/diamondsbg.svg')] bg-cover opacity-40 z-0" />
      )}
      <div
        ref={suggestRef}
        className={`flex flex-col w-full transition-all duration-1000 ease-in-out ${showSuggested ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <h2 className="mb-5 text-2xl font-semibold text-[#3D3D3D] z-10">
          You May Also Like
        </h2>
        <div className="flex md:flex-row md:gap-8 z-10">
          {randomProducts.map((product, i) => (
            <div
              key={i}
              className="flex  flex-col md:h-[350px] md:w-[25%] bg-transparent z-10"
            >
              <Image
                alt="product"
                src={product.img}
                className="h-[250px] w-full rounded-xl"
              />
              <p className="text-[#404040] text-[16px] font-normal mt-1">
                Test Item
              </p>
              <div className="flex flex-row justify-between items-center w-full mt-1">
                <p className="text-[16px] font-semibold">N200,000</p>
                <CiCirclePlus className="size-6 hover:cursor-pointer" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuggestedProducts;
