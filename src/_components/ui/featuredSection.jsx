"use client";
import React from "react";
import { BentoGrid, BentoGridItem } from "./bentoGrid";
import img from "@/assets/card.jpg";
import useInView from "@/hooks/useInView";
import diamond from "@/assets/diamond.png";
import Image from "next/image";
import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";

const FeaturedSection = ({ bestSellers }) => {
  const { ref: bestRef, isVisible: showBestSeller } = useInView();

  return (
    <div
      ref={bestRef}
      className="bg-gray-100 w-full px-4 md:px-40 py-10 md:pt-15 md:pb-20"
    >
      {/* <div className="absolute inset-0 bg-[url('/diamondsbg.svg')] bg-cover opacity-40 z-0" /> */}
      <div
        className={`w-full flex flex-col justify-center items-center transition-all duration-1000 ease-in-out z-10 ${showBestSeller ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      >
        <PageHeader
          title="Our Best Sellers"
          subtitle="Top Picks Loved by Our Customers — Shop the Best."
        />

        <BentoGrid className="z-10">
          {bestSellers.map((item, i) => (
            <BentoGridItem
              id={item?.id}
              key={item?.id}
              title={item?.name}
              imgSrc={item?.images[0]}
              price={item?.price}
              className={i === 1 ? "md:row-span-2" : ""}
            />
          ))}
        </BentoGrid>
      </div>
    </div>
  );
};

export default FeaturedSection;
