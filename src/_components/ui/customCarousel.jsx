"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import img from "@/assets/Screenshot 2025-03-31 091611.png";
import Link from "next/link";
import useInView from "@/hooks/useInView";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useSelector, useDispatch } from "react-redux";
import { get_all_products } from "@/store/customer/products/products-slice";
import { addToCart } from "@/store/customer/cart/cart-slice";
import { getGuestId } from "@/utils/getGeustId";
import { Button } from "@/components/ui/button";
import cart from "@/assets/cartdown.png";
import PageHeader from "@/components/ui/PageHeader";
export default function CustomCarousel() {
  const dispatch = useDispatch();
  const { trendingProducts, loading } = useSelector(
    (state) => state.customerProducts
  );
  // const trendingProducts =
  //   products?.filter((product) => product.trending === true) || [];

  const { ref: trendingRef, isVisible: showTrending } = useInView();
  const carouselRef = useRef(null);

  useEffect(() => {
    dispatch(get_all_products());
  }, [dispatch]);

  const goToPrev = () => {
    if (carouselRef.current) {
      carouselRef.current.previous();
    }
  };

  const goToNext = () => {
    if (carouselRef.current) {
      carouselRef.current.next();
    }
  };

  const responsive = {
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 5 },
    tablet: { breakpoint: { max: 1024, min: 640 }, items: 3 },
    mobile: { breakpoint: { max: 640, min: 0 }, items: 2 },
  };

  const { addLoadingId } = useSelector((state) => state.cart);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const userId = isAuthenticated ? user?.id : null;
  const guestId = !isAuthenticated ? getGuestId() : null;

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
    <div className=" w-full flex flex-col items-center pt-5 px-5 2xl:px-60 pb-12">
      {/* <div className="absolute inset-0 bg-[url('/diamondsbg.svg')] bg-cover opacity-40 z-0" /> */}

      <div
        className={`w-full overflow-hidden flex flex-col justify-center items-center  z-10 transition-all duration-1000 ease-in-out ${
          showTrending ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
        id="trending"
        ref={trendingRef}
      >
        <PageHeader
          title="Trending"
          subtitle="Stay Ahead of the Curve with These Trending Pieces."
        />

        <div className="relative w-full 2xl:w-[80%] pb-15">
          <Carousel
            ref={carouselRef}
            responsive={responsive}
            infinite={true}
            arrows={false}
            showDots={true}
            renderDotsOutside={true}
            itemClass="px-2 md:px-3 2xl:px-4"
            containerClass="md:flex md:justify-center md:items-center"
          >
            {trendingProducts?.map((item) => (
              <div
                key={item?.id}
                className="w-[158px] h-[270px] 
                         md:w-[250px] md:h-[330px] 
                         2xl:w-[250px] 2xl:h-[350px] 
                         relative"
              >
                <Link href={`/customer/product/${item?.id}`}>
                  <img
                    src={item?.images[0]}
                    alt={item?.name}
                    className="w-full 
             h-[270px] 
             md:h-[330px] 
             2xl:h-[350px] 
             object-cover rounded-2xl 
             hover:opacity-50 transition duration-300"
                  />

                  <div className="absolute left-2 bottom-2 bg-white/90 px-4 py-2 rounded-2xl shadow-md text-sm">
                    <p className="text-sm md:text-lg font-serif text-pink-500 font-semibold">
                      {item?.name}
                    </p>
                    <p className=" text-sm md:text-lg font-serif text-gray-700">
                      {Number(item?.price).toLocaleString("en-NG", {
                        style: "currency",
                        currency: "NGN",
                      })}
                    </p>
                  </div>
                </Link>
                <div className="absolute right-0 bottom-0 bg-gray-100 rounded-tl-md rounded-bl-0 rounded-br-md pb-0">
                  <Button
                    disabled={addLoadingId === item?.id}
                    className="bg-transparent hover:bg-transparent hover:cursor-pointer pb-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      addItemToCart(item?.id);
                    }}
                  >
                    {" "}
                    {addLoadingId === item?.id ? (
                      <div className="w-4 h-4 animate-spin border-2 border-pink-300 border-t-transparent rounded-full" />
                    ) : (
                      <Image src={cart} alt="cart-icon" className="size-5" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </Carousel>
          {/* {products?.data?.trendingProducts.length > 7 && ( */}

          <button
            onClick={goToPrev}
            className="md:hidden absolute bottom-0 right-3/4 md:right-2/3 bg-transparent text-gray-700 px-4 py-2 rounded-none border-1  text-xl border-gray-700 hover:cursor-pointer"
          >
            ‹
          </button>

          <button
            onClick={goToNext}
            className="md:hidden absolute bottom-0 left-3/4 md:left-2/3 bg-transparent text-gray-700  px-4 py-2 rounded-none border-1 text-xl border-gray-700 hover:cursor-pointer"
          >
            ›
          </button>

          {/* )} */}
        </div>
      </div>
      <Link
        className="px-4 py-2 rounded-xl bg-[#FD7DC3] mt-8 hover:animate-pulse"
        href="/customer/products"
      >
        View Our Store
      </Link>
    </div>
  );
}
