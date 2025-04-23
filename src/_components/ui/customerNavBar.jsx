"use client";
import Link from "next/link";
import React, { useState } from "react";
import { IoMdSearch } from "react-icons/io";
import { PiHandbagSimpleLight } from "react-icons/pi";
import { RxPerson } from "react-icons/rx";
import { usePathname, useRouter } from "next/navigation";
import logo from "@/assets/logo22.svg";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SparklesCore } from "./sparkles";
import CustomerSideBar from "./customerSidebar";
import { IoIosArrowForward, IoMdMenu, IoMdClose } from "react-icons/io";
import { loginWithGoogle } from "@/store/admin-auth/admin-auth-slice";
import { useSelector, useDispatch } from "react-redux";
import { useGoogleLogin } from "@react-oauth/google";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { get_all_products } from "@/store/customer/products/products-slice";
import { AiOutlineLogout } from "react-icons/ai";
import { IoFilterOutline } from "react-icons/io5";

const CustomerNavBar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { items } = useSelector((state) => state.cart);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const navLinks = [
    { name: "Home", link: "/customer/home" },
    { name: "Product", link: "/customer/product" },
    { name: "About Us", link: "/customer/about" },
    { name: "Contact Us", link: "/customer/contact" },
  ];
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const pathname = usePathname();
  const dispatch = useDispatch();
  const handleLoginWithGoogle = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const { access_token } = response;

        dispatch(loginWithGoogle(access_token));
      } catch (err) {
        console.error("Google login failed:", err);
      }
    },
    onError: (error) => {
      console.error("Google login error:", error);
    },
  });

  const router = useRouter();
  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    router.push("/customer/home");
    dispatch(get_all_products());
  };

  const [open, setOpen] = useState(false);

  const handleClick = (type) => {
    // dispatch
    setOpen(false);
  };

  return (
    <div className="relative bg-[#F9689F] px-5 md:px-40 py-5 flex flex-row justify-between items-center w-[100vw] !h-[80px]">
      <div className="w-full absolute inset-0 h-full z-0">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={200}
          className="w-full h-full pointer-events-none"
          particleColor="#FFFFFF"
        />
      </div>

      <CustomerSideBar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <div className="flex flex-row sm:justify-between items-center gap-5 z-10">
        <Image src={logo} alt="logo" className="w-[120px] md:w-[200px]" />
        <div className="hidden md:flex flex-row gap-5">
          {navLinks.map((link, index) => (
            <Link
              key={index}
              href={link.link}
              className={`text-[14px] font-semibold text-white ${pathname === link.link && "border-b-2 border-b-white"}`}
            >
              {link.name}
            </Link>
          ))}
          {isAuthenticated && (
            <Link
              href="/customer/myorders"
              className={`text-[14px] font-semibold text-white ${pathname === "/customer/myorders" && "border-b-2 border-b-white"}`}
            >
              My Orders
            </Link>
          )}
        </div>
      </div>

      <div className="flex flex-row items-center md:gap-5 z-10 me-2">
        <div
          className={`flex justify-between items-center gap-3 py-1 px-3 bg-gray-50 rounded-2xl me-1 w-[150px] md:w-[200px] ${pathname === "/customer/product" ? "" : "hidden"}`}
        >
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <IoFilterOutline
                size={20}
                className="text-gray-600 hover:cursor-pointer"
              />
            </PopoverTrigger>
            <PopoverContent className="w-56 p-4 space-y-4">
              <div className="text-sm font-semibold text-gray-700  pb-2">
                Filter By Price
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleClick("lowest")}
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition"
                >
                  Lowest Price
                </button>
                <button
                  onClick={() => handleClick("highest")}
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition"
                >
                  Highest Price
                </button>
              </div>
            </PopoverContent>
          </Popover>
          {/* <input
            type="text"
            className="bg-transparent py-1 px-1 text-md w-[80%] focus:outline-none"
            placeholder="Search"
          /> */}
          <Popover open={searchOpen} onOpenChange={setSearchOpen}>
            <PopoverTrigger asChild>
              <div className="relative  md:w-full">
                <input
                  type="text"
                  value={query}
                  onFocus={() => setSearchOpen(true)}
                  onChange={(e) => setQuery(e.target.value)}
                  className="bg-transparent py-1 px-1 text-md w-full focus:outline-none"
                  placeholder="Search"
                />
              </div>
            </PopoverTrigger>

            {query && (
              <PopoverContent className="w-full p-2 max-h-60 overflow-y-auto shadow-md rounded-md">
                {results.length > 0 ? (
                  <ul className="space-y-1">
                    {results.map((item) => (
                      <Link href={`/customer/product/${item?.id}`}>
                        <li
                          key={index}
                          className="flex flex-row items-center p-2 gap-2"
                          onClick={() => {
                            setSearchOpen(false);
                          }}
                        >
                          <img src="" alt="" /> <p>{item.name}</p>
                        </li>
                      </Link>
                    ))}
                  </ul>
                ) : (
                  <div className="text-sm text-gray-500 p-2">
                    No results found
                  </div>
                )}
              </PopoverContent>
            )}
          </Popover>

          <button className="hover:cursor-pointer">
            <IoMdSearch size={20} className="text-gray-600" />
          </button>
        </div>
        <Link href="/customer/cart" className="relative me-2 md:me-0">
          <PiHandbagSimpleLight className="text-white font-bold text-[25px] md:text-[30px]" />
          <span className="bg-red-500 text-white absolute bottom-3 rounded-full text-sm font-medium -right-4 px-2 py-1 h-6 flex items-center justify-center text-center hover:cursor-pointer">
            {totalItems ?? 0}
          </span>
        </Link>
        <div className="relative hidden md:block">
          {isAuthenticated ? (
            <Popover>
              <PopoverTrigger>
                <RxPerson
                  size={30}
                  className="text-white font-bold hidden md:block hover:cursor-pointer"
                />
              </PopoverTrigger>
              <PopoverContent className="w-40 p-4 shadow-lg rounded-md border border-gray-200">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col">
                    <p className="text-sm font-semibold text-gray-800">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate max-w-full">
                      {user?.email}
                    </p>
                  </div>

                  <button
                    className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors mt-3"
                    onClick={handleLogout}
                  >
                    <AiOutlineLogout className="text-red-500 text-base" />
                    Logout
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <>
              <Button
                onClick={handleLoginWithGoogle}
                className="hidden md:flex bg-white py-2.5 px-3 rounded-2xl hover:bg-gray-100 relative z-20 text-[#DE0D6F] font-medium "
              >
                Sign In
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="md:hidden z-20">
        <IoMdMenu
          size={28}
          className="text-white cursor-pointer"
          onClick={() => setIsSidebarOpen(true)}
        />
      </div>
    </div>
  );
};

export default CustomerNavBar;
