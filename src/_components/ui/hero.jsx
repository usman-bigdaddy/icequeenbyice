"use client";
import Image from "next/image";
import logo from "@/assets/logo22.svg";
import Link from "next/link";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { Button } from "@/components/ui/button";
import header1 from "@/assets/header1.png";
import { IoIosArrowForward, IoMdMenu, IoMdClose } from "react-icons/io";
import { SparklesCore } from "@/_components/ui/sparkles";
import { useState, useEffect } from "react";
import clsx from "clsx";
import CustomerSideBar from "./customerSidebar";
import { FcGoogle } from "react-icons/fc";
import { loginWithGoogle } from "@/store/admin-auth/admin-auth-slice";
import { useSelector, useDispatch } from "react-redux";
import { useGoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { get_all_products } from "@/store/customer/products/products-slice";
import { PiHandbagSimpleLight } from "react-icons/pi";
import { RxPerson } from "react-icons/rx";
import { AiOutlineLogout } from "react-icons/ai";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import diamond from "@/assets/diamond.png";

const Hero = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const { items } = useSelector((state) => state.cart);
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const { loading } = useSelector((state) => state.customerProducts);

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

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    dispatch(get_all_products());
  };

  const carouselItems = [
    {
      titleLines: ["Unleash Your Inner Diva!", "Discover the Latest Trends"],
      image: header1,
    },
    {
      titleLines: ["Step Into Elegance", "With Timeless Pieces"],
      image: header1,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % carouselItems.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [carouselItems.length]);

  const item = carouselItems[activeIndex];

  return (
    <header className="bg-gradient-to-b from-[#DE0D6F] to-[#f7d2e9] h-[80vh] md:min-h-[80vh] lg:min-h-screen px-6 md:px-20 lg:px-40 relative overflow-hidden pt-2">
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

      {loading && (
        <div className="fixed inset-0 z-60 flex justify-center items-center backdrop-blur-xs bg-white/60">
          <Image
            width={100}
            src={diamond}
            alt="Loading"
            className="animate-bounce"
          />
        </div>
      )}

      <CustomerSideBar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <div className="flex justify-between items-center h-[8vh] md:h-[10vh] relative z-50">
        <Image
          src={logo}
          alt="logo"
          height={100}
          width={100}
          className="w-20 md:w-40"
        />
        <div className="hidden md:flex gap-6 items-center text-white text-base font-semibold font-rubik z-50">
          <Link href="/customer/home" className="border-b-1 border-b-white">
            Home
          </Link>
          <Link href="/customer/product">Products</Link>
          <Link href="/customer/about">About us</Link>
          <Link href="/customer/contact">Contact us</Link>
          {isAuthenticated && <Link href="/customer/myorders">My Orders</Link>}
        </div>
        {isAuthenticated ? (
          <div className="hidden  md:flex flex-row items-center gap-3">
            <Link href="/customer/cart" className="relative">
              <PiHandbagSimpleLight
                size={25}
                className="text-white font-bold"
              />
              <span className="bg-red-500 text-white absolute bottom-3 rounded-full text-sm font-medium -right-4 px-2 py-1 h-6 flex items-center justify-center text-center hover:cursor-pointer">
                {totalItems ?? 0}
              </span>
            </Link>

            <Popover>
              <PopoverTrigger>
                <RxPerson
                  size={25}
                  className="text-white font-bold hidden md:block hover:cursor-pointer"
                />
              </PopoverTrigger>
              <PopoverContent className="w-auto py-2 shadow-lg rounded-md border border-gray-200">
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
          </div>
        ) : (
          // <Button
          //   className="hidden md:flex bg-white py-2.5 px-4 rounded-2xl hover:bg-gray-100 relative z-20"
          //   onClick={handleLogout}
          // >
          //   <AiOutlineShoppingCart className="text-gray-700 size-6" />
          //   <span className="text-[#DE0D6F] font-medium font-rubik">
          //     Shop Now
          //   </span>
          // </Button>
          <div className="hidden  md:flex flex-row items-center gap-4">
            <Link href="/customer/cart" className="relative">
              <PiHandbagSimpleLight
                size={25}
                className="text-white font-bold"
              />
              <span className="bg-red-500 text-white absolute bottom-3 rounded-full text-sm font-medium -right-4 px-2 py-1 h-6 flex items-center justify-center text-center hover:cursor-pointer">
                {totalItems ?? 0}
              </span>
            </Link>
            <Button
              onClick={handleLoginWithGoogle}
              className="hidden md:flex bg-white py-2.5 px-3 rounded-2xl hover:bg-gray-100 relative z-20 text-[#DE0D6F] font-medium "
            >
              Sign In
            </Button>
          </div>
        )}
        <div className="md:hidden">
          <IoMdMenu
            size={28}
            className="text-white cursor-pointer"
            onClick={() => setIsSidebarOpen(true)}
          />
        </div>
      </div>

      <div className="h-full flex items-center relative z-20 mt-[-20px] md:mt-0">
        <div
          key={`slide-${activeIndex}`}
          className="flex flex-col-reverse md:flex-row gap-6 md:gap-10 items-center justify-between w-full text-white animate-fade-in"
        >
          <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-start text-center md:text-left gap-2">
            {item.titleLines.map((line, i) => (
              <p
                key={i}
                className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold leading-tight"
              >
                {line}
              </p>
            ))}
            <Button className="mx-auto md:mx-0 w-[220px] md:w-[250px] py-3 md:py-5 px-6 md:px-8 rounded-3xl bg-black/80 text-white text-sm md:text-md font-semibold hover:bg-white hover:text-[#F9689F] transition mt-4">
              <span>Explore Our Collection</span>
              <IoIosArrowForward size={20} className="ml-2" />
            </Button>
          </div>

          <div className="flex w-full md:w-1/2 justify-center items-end">
            <img
              src={item.image.src}
              alt={`carousel-${activeIndex}`}
              className="w-full h-[250px] md:h-[80%] object-contain lg:object-cover self-end"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Hero;
