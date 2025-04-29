"use client";

import Footer from "@/_components/ui/footer";
import CustomerNavBar from "@/_components/ui/customerNavBar";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { fetchCart } from "@/store/customer/cart/cart-slice";
import { getGuestId } from "@/utils/getGeustId";
import { useSelector } from "react-redux";
import { FaArrowUp } from "react-icons/fa";

export default function CustomerLayout({ children }) {
  const pathname = usePathname();

  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const userId = isAuthenticated ? user?.id : null;
  const guestId = !isAuthenticated ? getGuestId() : null;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCart({ userId, guestId }));
  }, [isAuthenticated, dispatch]);

  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShow(window.scrollY > 100);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {pathname !== "/customer/home" && <CustomerNavBar />}
      <main className="flex-1">{children}</main>
      <Footer />
      {show && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 bg-pink-600 text-white rounded-full shadow-lg z-50 hover:cursor-pointer"
        >
          <FaArrowUp />
        </button>
      )}
    </div>
  );
}
