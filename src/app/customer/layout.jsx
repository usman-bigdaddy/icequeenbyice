"use client";

import Footer from "@/_components/ui/footer";
import CustomerNavBar from "@/_components/ui/customerNavBar";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { fetchCart } from "@/store/customer/cart/cart-slice";
import { getGuestId } from "@/utils/getGeustId";
import { useSelector } from "react-redux";

export default function CustomerLayout({ children }) {
  const pathname = usePathname();

  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const userId = isAuthenticated ? user?.id : null;
  const guestId = !isAuthenticated ? getGuestId() : null;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCart({ userId, guestId }));
  }, [isAuthenticated, dispatch]);

  return (
    <div className="min-h-screen flex flex-col">
      {pathname !== "/customer/home" && <CustomerNavBar />}
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
