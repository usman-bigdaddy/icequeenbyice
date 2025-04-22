import { IoMdClose } from "react-icons/io";
import Link from "next/link";
import { AiOutlineShoppingCart } from "react-icons/ai";

const CustomerSideBar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  return (
    <div
      className={`fixed top-0 right-0 h-full w-3/4 sm:w-1/2 bg-white z-[999] shadow-lg transform transition-transform duration-500 ease-in-out ${
        isSidebarOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="p-6 flex flex-col gap-6 text-black font-semibold">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-bold text-[#DE0D6F]">Menu</span>
          <IoMdClose
            size={24}
            onClick={() => setIsSidebarOpen(false)}
            className="cursor-pointer text-gray-700"
          />
        </div>
        <Link href="/customer/home" onClick={() => setIsSidebarOpen(false)}>
          Home
        </Link>
        <Link href="/customer/product" onClick={() => setIsSidebarOpen(false)}>
          Products
        </Link>
        <Link href="#" onClick={() => setIsSidebarOpen(false)}>
          About Us
        </Link>
        <Link href="#" onClick={() => setIsSidebarOpen(false)}>
          Contact Us
        </Link>
        <Link
          href="/customer/product"
          className="flex gap-2 items-center bg-[#DE0D6F] text-white py-2 px-4 rounded-full mt-4"
        >
          <AiOutlineShoppingCart />
          Shop Now
        </Link>
      </div>
    </div>
  );
};

export default CustomerSideBar;
