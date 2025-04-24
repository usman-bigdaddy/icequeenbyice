"use client";

import { FaRegBell } from "react-icons/fa";
import { Avatar, AvatarFallback } from "@/_components/ui/avatar";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getUser } from "@/store/admin-auth/admin-auth-slice";
import { get_pending_orders } from "@/store/orders/orders-thunks";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AiOutlineLogout } from "react-icons/ai";
import { logoutUser } from "@/store/admin-auth/admin-auth-slice";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Formfield from "../ui/formField";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Change_Password_Schema } from "@/lib/form-schema";
import { change_password } from "@/store/admin-auth/admin-auth-slice";
import { useRouter } from "next/navigation";
import { IoMdMenu } from "react-icons/io";
import Sidebar from "../ui/SideBar";

const Header = () => {
  const [isSideOpen, setIsSideOpen] = useState(false);
  const { user, loading } = useSelector((state) => state.auth);
  const { pending_orders, fetched, isloading } = useSelector(
    (state) => state.order
  );
  const form = useForm({
    resolver: zodResolver(Change_Password_Schema),
    defaultValues: {
      password: "",
      password2: "",
    },
  });
  const dispatch = useDispatch();

  // const memoized_pending_orders = useMemo(
  //   () => pending_orders,
  //   [pending_orders]
  // );

  const router = useRouter();

  const adminLinks = [
    {
      label: "Dashboard",
      href: "/admin/dashboard",
    },
    {
      label: "Products",
      href: "/admin/products",
    },
    {
      label: "Orders",
      href: "/admin/orders",
    },
    {
      label: "Users",
      href: "/admin/users",
    },
  ];

  useEffect(() => {
    if (!fetched && !isloading) {
      dispatch(get_pending_orders());
    }
  }, [dispatch, fetched, isloading]);

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(get_pending_orders());
    }, 320000);
    return () => clearInterval(interval);
  }, [dispatch]);

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    toast.warn("Logout successful");
  };

  const action = [
    {
      label: "Logout",
      onClick: handleLogout,
      className: "bg-[#DE0D6F] text-white py-2 px-4 rounded-full mt-1",
    },
  ];

  const onSubmit = (values) => {
    if (values.password !== values.password2) {
      toast.warn("Passwords don't match");
    } else {
      dispatch(change_password({ id: user.id, password: values.password }));
      form.reset();
      dispatch({ type: "LOGOUT" });
    }
  };

  return (
    <header className="w-full shadow-lg  p-5 pt-8">
      <div className="flex justify-between items-center w-full  mx-auto">
        <div>
          <p className="font-medium text-lg text-gray-600">
            Hello, {user?.name || "Admin"}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <FaRegBell className="text-2xl text-gray-600" />
            {pending_orders.length > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="bg-red-500 text-white absolute bottom-3 rounded-full text-sm font-medium -right-4 px-2 py-1 h-6 flex items-center justify-center text-center hover:cursor-pointer">
                    {pending_orders.length}
                  </TooltipTrigger>
                  <TooltipContent className="bg-white border-1 border-[#DE0D6F] text-gray-600">
                    <p>{`You have ${pending_orders.length} pending ${pending_orders.length === 1 ? "order" : "orders"}`}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>

          <div className="md:hidden pl-3">
            <IoMdMenu
              size={28}
              className=" cursor-pointer"
              onClick={() => setIsSideOpen(true)}
            />
          </div>

          <Sidebar
            isSidebarOpen={isSideOpen}
            setIsSidebarOpen={setIsSideOpen}
            links={adminLinks}
            actions={action}
          />

          <div className="hidden md:flex flex-row items-center space-x-2">
            <Avatar>
              <AvatarFallback className="bg-amber-400">
                {user?.name?.slice(0, 2).toUpperCase() || "IN"}
              </AvatarFallback>
            </Avatar>
            <p className="font-md text-gray-600">
              {capitalizeFirstLetter(user?.role)}
            </p>
            <Popover>
              <PopoverTrigger>
                <MdOutlineKeyboardArrowDown className="text-xl font-medium text-gray-700 hover:cursor-pointer" />
              </PopoverTrigger>
              <PopoverContent className="w-36">
                <div className="flex flex-col gap-2 ">
                  <p className="text-xs font-medium text-gray-700 border-b-1 border-gray-400">
                    {user?.name}
                  </p>
                  <p className="text-xs font-medium text-gray-700 border-b-1 border-gray-400">
                    {user?.email}
                  </p>
                  <Dialog>
                    <DialogTrigger className="text-xs font-medium text-gray-700 border-b-1 border-gray-400 hover:cursor-pointer">
                      Change Password
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Change Password</DialogTitle>
                      </DialogHeader>
                      <div className="flex flex-col">
                        <Form {...form}>
                          <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="w-full"
                          >
                            <Formfield
                              control={form.control}
                              type="password"
                              name="password"
                              label="New Password"
                              placeholder="Enter password"
                              className="mt-4 text-gray-700"
                            />

                            <Formfield
                              control={form.control}
                              type="password"
                              name="password2"
                              label="Confirm Password"
                              placeholder="Confirm password"
                              className="mt-4 text-gray-700"
                            />

                            <Button
                              type="submit"
                              className="w-[100%] mt-4 ext-white  font-semibold text-md 
  bg-[#DE0D6F] hover:bg-white hover:border-1 hover:border-[#DE0D6F] hover:text-gray-700  transition duration-300"
                            >
                              Save
                            </Button>
                          </form>
                        </Form>
                      </div>
                      {/* <DialogFooter>
                        <Button type="submit">Save changes</Button>
                      </DialogFooter> */}
                    </DialogContent>
                  </Dialog>
                  <button
                    className="text-xs font-medium text-gray-700 flex flex-row items-center gap-1 hover:cursor-pointer"
                    onClick={handleLogout}
                  >
                    <AiOutlineLogout className="text-red-600 text-sm" />
                    logout
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;
