import { IoMdClose } from "react-icons/io";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen, links, actions }) => {
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

        {links?.map(({ label, href }, index) => (
          <Link key={index} href={href} onClick={() => setIsSidebarOpen(false)}>
            {label}
          </Link>
        ))}

        {actions?.map(({ label, icon: Icon, onClick, className }, index) =>
          Icon ? (
            <button
              key={index}
              onClick={onClick}
              className={`flex gap-2 items-center ${className}`}
            >
              <Icon />
              {label}
            </button>
          ) : (
            <Button key={index} onClick={onClick} className={className}>
              {label}
            </Button>
          )
        )}
      </div>
    </div>
  );
};

export default Sidebar;
