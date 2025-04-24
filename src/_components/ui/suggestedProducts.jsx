"use client";
import { useEffect } from "react";
import Image from "next/image";
import { CiCirclePlus } from "react-icons/ci";
import useInView from "@/hooks/useInView";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { getGuestId } from "@/utils/getGeustId";
import { addToCart } from "@/store/customer/cart/cart-slice";
import fastcart from "@/assets/cartdown.png";
import { Button } from "@/components/ui/button";

const SuggestedProducts = ({ bg, style }) => {
  const { ref: suggestRef, isVisible: showSuggested } = useInView();
  const { bestSellers } = useSelector((state) => state.customerProducts);

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { addLoadingId, cartLoading } = useSelector((state) => state.cart);

  const userId = isAuthenticated ? user?.id : null;
  const guestId = !isAuthenticated ? getGuestId() : null;
  const dispatch = useDispatch();

  const addItemToCart = (productId) => {
    const userOrGuestId = isAuthenticated ? userId : guestId;
    // const action = "increment";
    const quantity = count[productId] || 1;
    const payload = {
      productId,
      quantity,
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
      className={`relative px-5 py-10 md:px-40 2xl:px-80 md:pb-20 md:pt-10 ${style}`}
    >
      {!bg && (
        <div className="absolute inset-0 bg-[url('/diamondsbg.svg')] bg-cover opacity-40 z-0" />
      )}
      <div
        ref={suggestRef}
        className={`flex flex-col w-full transition-all duration-1000 ease-in-out ${showSuggested ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <h2 className="mb-5 text-2xl font-semibold text-[#3D3D3D] z-10">
          You May Also Like
        </h2>
        <div className="flex flex-col gap-3 md:flex-row md:gap-8 z-10">
          {bestSellers?.map((product) => (
            <div
              key={product?.id}
              className="flex  flex-col md:h-[350px] md:w-[25%] bg-transparent z-10"
            >
              <Link href={`/customer/product/${product?.id}`}>
                <img
                  alt="product"
                  src={product?.images[0]}
                  className="h-[250px] w-full rounded-xl object-cover"
                />

                <p className="text-pink-500 text-[16px] font-serif mt-1">
                  {product?.name}
                </p>
              </Link>
              <div className="flex flex-row justify-between items-center w-full mt-1">
                <Link href={`/customer/product/${product?.id}`}>
                  <p className="text-[14px] font-semibold font-serif ">
                    {Number(product?.price).toLocaleString("en-NG", {
                      style: "currency",
                      currency: "NGN",
                    })}
                  </p>
                </Link>
                <Button
                  className="bg-gray-100 hover:bg-pink-50 rounded-full p-1.5 shadow-sm border border-gray-200 transition-colors hover:cursor-pointer"
                  onClick={() => addItemToCart(product?.id)}
                  disabled={addLoadingId === product?.id}
                >
                  {addLoadingId === product?.id ? (
                    <div className="w-4 h-4 animate-spin border-2 border-pink-500 border-t-transparent rounded-full" />
                  ) : (
                    <img
                      src={fastcart.src}
                      alt="cart-icon"
                      className="size-4 sm:size-5 md:size-6"
                    />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuggestedProducts;
