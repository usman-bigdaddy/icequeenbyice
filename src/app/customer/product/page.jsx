"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { PiTimerFill } from "react-icons/pi";
import { Button } from "@/components/ui/button";
import fastcart from "@/assets/cartdown.png";
import DiscountSection from "@/_components/ui/discountSection";
import FeaturedSection from "@/_components/ui/featuredSection";
import diamond from "@/assets/diamond.png";
import { useSelector, useDispatch } from "react-redux";
import {
  get_all_products,
  get_customer_paginated_products,
} from "@/store/customer/products/products-slice";
import Link from "next/link";
import { getGuestId } from "@/utils/getGeustId";
import { addToCart } from "@/store/customer/cart/cart-slice";
import PageHeader from "@/components/ui/PageHeader";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

const page = () => {
  const dispatch = useDispatch();
  const { bestSellers, loading, paginated_products, isLoading } = useSelector(
    (state) => state.customerProducts
  );

  const { addLoadingId, cartLoading } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(get_all_products());
  }, [dispatch]);

  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(get_customer_paginated_products(page));
  }, [dispatch, page]);

  const handleNextPage = () => setPage((prev) => prev + 1);
  const handlePrevPage = () => setPage((prev) => Math.max(prev - 1, 1));

  const [count, setCount] = useState({});

  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const userId = isAuthenticated ? user?.id : null;
  const guestId = !isAuthenticated ? getGuestId() : null;

  const increment = (itemId) => {
    setCount((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 1) + 1,
    }));
  };

  const decrement = (itemId) => {
    setCount((prev) => ({
      ...prev,
      [itemId]: prev[itemId] > 1 ? prev[itemId] - 1 : 1,
    }));
  };

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

  useEffect(() => {
    if (paginated_products.length > 0) {
      const initialCounts = {};
      paginated_products.forEach((item) => {
        initialCounts[item.id] = item.count || 1;
      });
      setCount(initialCounts);
    }
  }, [paginated_products]);

  // useEffect(() => {
  //   const userId = session?.user?.id;
  //   const guestId = getGuestId();

  //   dispatch(fetchCart({ userId, guestId }));
  // }, [session, dispatch]);

  return (
    <>
      <div
        className={`flex flex-col items-center pt-5 pb-8 px-5 md:px-40 2xl:px-80 bg-gray-100 relative ${loading ? "min-h-screen" : ""}`}
      >
        {/* <div className="absolute inset-0 bg-[url('/diamondsbg.svg')] bg-cover opacity-40 z-0" /> */}
        {loading ||
          (isLoading && (
            <div className="fixed inset-0 z-50 flex justify-center items-center backdrop-blur-xs bg-white/60">
              <Image
                width={100}
                src={diamond}
                alt="Loading"
                className="animate-bounce"
              />
            </div>
          ))}
        <PageHeader
          title="Our Products"
          subtitle="Your curated selection of elegance."
        />

        <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 md:mb-20 z-10">
          {paginated_products?.map((item) => (
            <div
              key={item?.id}
              className="flex flex-col bg-transparent p-2 rounded-lg w-full max-w-[185px] sm:max-w-[200px] md:max-w-none h-[300px] sm:h-[320px] md:h-[400px] 2xl:h-[500px]"
            >
              <Link href={`/customer/product/${item?.id}`} className="flex-1">
                <img
                  src={item?.images[0]}
                  alt={item?.name}
                  className="w-full h-[150px] sm:h-[170px] md:h-[250px] 2xl:h-[370px] object-cover rounded-lg hover:scale-[1.02] transition-transform duration-200"
                  loading="lazy"
                />
              </Link>

              <div className="flex flex-col w-full pt-1 pb-1">
                <Link href={`/customer/product/${item?.id}`} className="flex-1">
                  <div className="flex flex-col gap-0 mb-1">
                    <p className="text-xs sm:text-sm md:text-base font-medium text-gray-800 line-clamp-2">
                      {item?.name}
                    </p>
                    <p className="text-sm sm:text-base md:text-lg font-bold text-pink-600">
                      {Number(item?.price).toLocaleString("en-NG", {
                        style: "currency",
                        currency: "NGN",
                      })}
                    </p>
                  </div>
                </Link>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1 bg-white rounded-lg px-2 py-1.5 shadow-sm border border-gray-200">
                    <button
                      disabled={count === 1}
                      onClick={() => decrement(item?.id)}
                      className="text-base text-gray-700 hover:text-pink-600 px-1 disabled:text-gray-400"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={count[item?.id] || 1}
                      onChange={(e) => {
                        const newCount = Math.max(1, Number(e.target.value));
                        setCount((prev) => ({
                          ...prev,
                          [item.id]: newCount,
                        }));
                      }}
                      min={1}
                      className="w-8 sm:w-10 text-center text-sm md:text-base border-gray-300 rounded appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button
                      onClick={() => increment(item?.id)}
                      className="text-base text-gray-700 hover:text-pink-600 px-1"
                    >
                      +
                    </button>
                  </div>

                  <Button
                    className="bg-gray-100 hover:bg-pink-50 rounded-full p-1.5 shadow-sm border border-gray-200 transition-colors"
                    onClick={() => addItemToCart(item?.id)}
                    disabled={addLoadingId === item?.id}
                  >
                    {addLoadingId === item.id ? (
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
            </div>
          ))}
        </div>

        <div className="mt-1  flex gap-2">
          <button
            onClick={handlePrevPage}
            disabled={page === 1}
            className="bg-transparent text-gray-700 inline-flex items-center  px-4 py-2 rounded-none border-1 text-xl border-gray-700 hover:cursor-pointer"
          >
            <IoIosArrowBack /> Prev
          </button>
          <button
            disabled={isLoading}
            onClick={handleNextPage}
            className="bg-transparent inline-flex items-center text-gray-700  px-4 py-2 rounded-none border-1 text-xl border-gray-700 hover:cursor-pointer"
          >
            Next <IoIosArrowForward />
          </button>
        </div>
      </div>
      <DiscountSection />
      <FeaturedSection bestSellers={bestSellers} />
    </>
  );
};

export default page;
