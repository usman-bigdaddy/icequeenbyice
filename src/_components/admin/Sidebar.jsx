"use client";

import {
  BsArrowLeftShort,
  BsSearch,
  BsChevronDown,
  BsFillImageFill,
  BsReverseLayoutTextSidebarReverse,
  BsPerson,
} from "react-icons/bs";
import {
  AiFillEnvironment,
  AiOutlineBarChart,
  AiOutlineFileText,
  AiOutlineMail,
  AiOutlineSetting,
  AiOutlineLogout,
  AiOutlineFile,
} from "react-icons/ai";
import { RiDashboardFill } from "react-icons/ri";

import Image from "next/image";
import { adminSideBarLinks } from "../../../constants";
import Link from "next/link";
import { cn, getInitials } from "@/lib/utils";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import logo from "@/assets/icequeenLogo.png";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const Sidebar = () => {
  const [active, setActive] = useState("/admin/dashboard");
  const { isAuthenticated, user, token } = useSelector((state) => state.auth);
  const router = useRouter();

  const pathname = usePathname();

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    toast.warn("Logout successful");
  };

  useEffect(() => {
    if (isAuthenticated === false) {
      router.replace("/sign-in");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    setActive(pathname);
    if (pathname.startsWith("/admin/orders/")) {
      setActive("/admin/orders");
    }
  }, [pathname]);
  return (
    <div className="flex">
      <div
        className={`bg-white shadow-lg h-screen p-5 pt-4  hidden w-72 md:block   duration-300 relative`}
      >
        <div className="inline-flex w-full h-15  px-2 ">
          <Image src={logo} alt="logo" className="max-w-fit max-h-fit " />
        </div>

        <div
          className={`flex items-center rounded-md bg-transparent border border-gray-500 mt-6 py-2  px-4`}
        >
          <BsSearch
            className={`text-primary text-lg block float-left cursor-pointer mr-2`}
          />
          <input
            type={"search"}
            placeholder="Search"
            className={`text-base bg-transparent w-full
             text-primary focus:outline-none `}
          />
        </div>

        <ul className="pt-2">
          {adminSideBarLinks.map((menu, index) => (
            <li key={index}>
              {" "}
              <Link
                className={`text-gray-600 text-sm flex items-center
                gap-x-4 cursor-pointer p-2 hover:bg-[#DE0D6F] hover:text-white 
                rounded-md ${menu.spacing ? "mt-6" : "mt-2"} ${menu.logout && "mt-24"} ${active == menu.route ? "bg-[#DE0D6F] text-white" : ""}
                `}
                href={menu.route || ""}
                onClick={() => {
                  if (menu.logout) {
                    dispatch(handleLogout);
                  }
                }}
              >
                <span
                  className={`text-2xl block float-left  ${active == menu.route ? " text-white" : ""}`}
                >
                  {menu.icon ? <menu.icon /> : <RiDashboardFill />}
                </span>
                <span
                  className={`
                  md:block
                  text-base font-medium flex-1
                  duration-200
                  `}
                >
                  {menu.text}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
