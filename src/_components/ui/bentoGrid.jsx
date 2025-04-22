"use client";
import { cn } from "@/lib/utils";
import cart from "@/assets/cartdown.png";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { addToCart } from "@/store/customer/cart/cart-slice";
import { useDispatch } from "react-redux";
import { getGuestId } from "@/utils/getGeustId";
import { useSelector } from "react-redux";

export const BentoGrid = ({ className, children }) => {
  return (
    <div
      className={cn(
        "w-full grid grid-cols-1 gap-y-4 md:!gap-y-3 md:!gap-x-1  md:grid-cols-3",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({ imgSrc, title, className, id, price }) => {
  const { addLoadingId } = useSelector((state) => state.cart);
  const isLoading = addLoadingId === id;
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const userId = isAuthenticated ? user?.id : null;
  const guestId = !isAuthenticated ? getGuestId() : null;

  const dispatch = useDispatch();

  const addItemToCart = (productId) => {
    const userOrGuestId = isAuthenticated ? userId : guestId;
    const action = "increment";
    const payload = {
      productId,
      action,
    };

    if (isAuthenticated && userOrGuestId) {
      payload.userId = userOrGuestId;
    } else if (!isAuthenticated && userOrGuestId) {
      payload.guestId = userOrGuestId;
    }
    dispatch(addToCart(payload));
  };

  return (
    <div
      className={`relative md:w-[335px] md:min-h-[220px] rounded-xl  ${className}`}
    >
      <Link href={`/customer/product/${id}`}>
        <img
          src={imgSrc}
          alt={title}
          className="h-full w-full object-cover rounded-xl opacity-85 hover:opacity-100 transition-transform duration-300 hover:cursor-pointer"
          loading="lazy"
        />

        <div className="absolute left-2 bottom-2 bg-white/90 px-4 py-2 rounded-2xl shadow-md text-sm">
          <p className="font-serif text-pink-500 font-semibold">{title}</p>
          <p className="font-serif text-gray-700">
            {Number(price).toLocaleString("en-NG", {
              style: "currency",
              currency: "NGN",
            })}
          </p>
        </div>
      </Link>
      <div className="absolute right-0 bottom-0 bg-gray-100 rounded-tl-md rounded-bl-0 rounded-br-md pb-0">
        <Button
          disabled={isLoading}
          className="bg-transparent hover:bg-transparent hover:cursor-pointer pb-0"
          onClick={() => addItemToCart(id)}
        >
          {" "}
          {isLoading ? (
            <div className="w-4 h-4 animate-spin border-2 border-pink-300 border-t-transparent rounded-full" />
          ) : (
            <Image src={cart} alt="cart-icon" className="size-7" />
          )}
        </Button>
      </div>
    </div>
  );
};
