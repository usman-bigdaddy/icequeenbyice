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
    <footer className="relative w-full pt-10 bg-[#F9689F] pb-5 flex flex-col overflow-hidden">
      {/* Sparkles background */}
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

      {/* Main content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* Logo */}
        <div className="flex justify-center md:justify-start">
          <Link href="/customer/home">
            {" "}
            <Image
              src={logo}
              alt="logo"
              className="w-44 md:w-52 h-auto max-h-24 object-contain"
              priority
            />
          </Link>
        </div>

        {/* Links grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 md:mt-12">
          {/* Products column */}
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold text-black mb-4">Products</h2>
            <div className="flex flex-col gap-3">
              {products.map((item, index) => (
                <Link
                  href={item.link}
                  className="text-gray-100 text-base font-light hover:text-white transition-colors duration-200"
                  key={`product-${index}`}
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>

          {/* Support column */}
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold text-black mb-4">Support</h2>
            <div className="flex flex-col gap-3">
              {supportLinks.map((item, index) => (
                <Link
                  href={item.link}
                  className="text-gray-100 text-base font-light hover:text-white transition-colors duration-200"
                  key={`support-${index}`}
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>

          {/* Other Pages column */}
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold text-black mb-4">
              Other Pages
            </h2>
            <div className="flex flex-col gap-3">
              {otherpages.map((item, index) => (
                <Link
                  href={item.link}
                  className="text-gray-100 text-base font-light hover:text-white transition-colors duration-200"
                  key={`page-${index}`}
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Newsletter (uncomment if needed) */}
        {/* <div className="mt-12 max-w-2xl mx-auto text-center">
          <h3 className="text-2xl text-white font-light mb-4">
            Subscribe To Our Newsletter to Stay Updated About Discounts
          </h3>
          <div className="flex max-w-md mx-auto bg-[#D45987] rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-white/50">
            <input
              type="email"
              className="flex-grow bg-transparent px-4 py-2 text-white placeholder-gray-200 focus:outline-none"
              placeholder="person@email.com"
            />
            <button className="bg-black/80 text-white p-2 rounded-full hover:bg-black transition-colors duration-200">
              <IoIosArrowForward size={20} />
            </button>
          </div>
        </div> */}

        {/* Copyright */}
        <div className="mt-12 pt-4 border-t border-white/20 flex flex-col sm:flex-row justify-center items-center gap-2 text-sm text-white">
          <p>&copy; {new Date().getFullYear()} All Rights Reserved.</p>
          <span className="hidden sm:inline">•</span>
          <p>
            Designed by{" "}
            <a
              href="https://www.softechseamless.com.ng/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline hover:text-gray-300 transition-colors duration-200"
            >
              Softech Seamless
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
