"use client";
import React from "react";
import logo from "@/assets/logo22.svg";
import Image from "next/image";
import { IoIosArrowForward } from "react-icons/io";
import Link from "next/link";
import { SparklesCore } from "./sparkles";

const products = [
  { title: "All Products ", link: "/customer/product" },
  { title: "New Arrivals", link: "/customer/product" },
  { title: "Top Picks", link: "/customer/product" },
];

const otherpages = [
  { title: "Home", link: "/customer/home" },
  { title: "About Us", link: "/customer/about" },
  { title: "Cart Page", link: "/customer/cart" },
];

const supportLinks = [
  { title: "Contact", link: "/customer/contact" },
  { title: "FAQs", link: "/customer/faq" },
  { title: "Shipping & Returns", link: "#" },
];

const Footer = () => {
  return (
    <div className="relative w-[100vw]  pt-10 bg-[#F9689F] pb-5 flex flex-col">
      <div className="w-full absolute inset-0 h-full z-0">
        <SparklesCore
          id="particles"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={200}
          className="w-full h-full pointer-events-none"
          particleColor="#FFFFFF"
        />
      </div>
      <div className="flex flex-start md:px-10 z-10">
        <Image src={logo} alt="logo" className="w-[220px] h-[100px]" />
      </div>
      {/* <div className="flex flex-col justify-center items-center mt-2 md:px-40">
        <p className="text-2xl text-white font-extralight">
          Subscribe To Your Newsletter to Stay Updated About Discounts
        </p>
        <p className="text-2xl text-white font-extralight">
          Updated About Discounts
        </p>
        <div className="inline-flex justify-between items-center px-4 py-1 bg-[#D45987] rounded-4xl mt-5 ">
          <input
            type="email"
            className="bg-transparent p-2 focus:outline-none"
            placeholder="person@email.com"
          />
          <button className="bg-black/80 text-white text-[16px] p-2  text-lg rounded-full hover:animate-pulse hover:cursor-pointer">
            <IoIosArrowForward />
          </button>
        </div>
      </div> */}

      <div className="flex md:flex-row  flex-wrap gap-y-10 md:gap-y-0 justify-between items-start w-full mt-2 px-10 md:px-40 pb-10 z-10">
        <div className="flex flex-col gap-2 md:gap-4 w-full sm:w-1/2 md:w-auto">
          <h2 className="text-xl font-semibold text-black mb-2">Products</h2>
          {products.map((item, index) => (
            <Link
              href={item.link}
              className="text-gray-100 text-[14px] font-extralight hover:cursor-pointer"
              key={index}
            >
              {item.title}
            </Link>
          ))}
        </div>
        <div className="flex flex-col gap-2 md:gap-4">
          <h2 className="text-xl font-semibold text-black mb-2">Support</h2>
          {supportLinks.map((item, index) => (
            <Link
              href={item.link}
              className="text-gray-100 text-[14px] font-extralight hover:cursor-pointer"
              key={index}
            >
              {item.title}
            </Link>
          ))}
        </div>
        <div className="flex flex-col gap-2 md:gap-4">
          <h2 className="text-xl font-semibold text-black mb-2">Other Pages</h2>
          {otherpages.map((item, index) => (
            <Link
              href={item.link}
              className="text-gray-100 text-[14px] font-extralight hover:cursor-pointer"
              key={index}
            >
              {item.title}
            </Link>
          ))}
        </div>
      </div>
      <div className="flex justify-center items-center border-t-1 border-t-gray-50  w-full pt-2 gap-0.5  pb-3 z-10">
        <p className="text-sm text-white ">
          &copy; {new Date().getFullYear()} All Rights Reserved.
        </p>
        <p className="text-sm text-white">
          Designed by{" "}
          <a
            href="https://softtechseamless.onrender.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-md font-semibold text-white underline hover:text-gray-300"
          >
            Softech Seamless
          </a>
        </p>
      </div>
    </div>
  );
};

export default Footer;
