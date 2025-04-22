"use client";
import { useEffect } from "react";
import Image from "next/image";
import img from "@/assets/card.jpg";
import { PiTimerFill } from "react-icons/pi";
import fastcart from "@/assets/fastcart.png";
import naira from "@/assets/naira.png";
import { FaCartArrowDown } from "react-icons/fa6";
import CustomCarousel from "@/_components/ui/customCarousel";
import TextSection from "@/_components/ui/textSection";
import VideoSection from "@/_components/ui/videoSection";
import Hero from "@/_components/ui/hero";
import Link from "next/link";
import diamond from "@/assets/diamond.png";
import useInView from "@/hooks/useInView";
import { Button } from "@/components/ui/button";
import { useSelector, useDispatch } from "react-redux";
import { get_all_products } from "@/store/customer/products/products-slice";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useSession } from "next-auth/react";
import { getGuestId } from "@/utils/getGeustId";
import { toast } from "react-toastify";
import { addToCart } from "@/store/customer/cart/cart-slice";
import PageHeader from "@/components/ui/PageHeader";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const page = () => {
  const { isAuthenticated, user, google_loading } = useSelector(
    (state) => state.auth
  );

  const userId = isAuthenticated ? user?.id : null;
  const guestId = !isAuthenticated ? getGuestId() : null;

  const { addLoadingId } = useSelector((state) => state.cart);

  const { ref: newProductsRef, isVisible: showNewProducts } = useInView();
  const { ref: featuredRef, isVisible: showFeatured } = useInView();
  const dispatch = useDispatch();
  const {
    newProducts,
    featuredProducts,
    trendingProducts,
    bestSellers,
    loading,
  } = useSelector((state) => state.customerProducts);

  // const newProducts = products?.length
  //   ? [...products]
  //       .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  //       .slice(0, 10)
  //   : [];

  // const featuredProducts =
  //   products?.filter((product) => product.featured === true) || [];

  useEffect(() => {
    dispatch(get_all_products());
  }, [dispatch]);

  // useEffect(() => {
  //   if (!isLoggedIn) {
  //     const guestId = getGuestId();
  //     console.log("Guest ID:", guestId);
  //   } else {
  //     console.log("User ID:", session?.user?.id);
  //   }
  // }, [isLoggedIn, session]);

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

  const responsive = {
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 3 },
    tablet: { breakpoint: { max: 1024, min: 640 }, items: 2 },
    mobile: { breakpoint: { max: 640, min: 0 }, items: 1 },
  };

  const FeaturedResponsive = {
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 4 },
    tablet: { breakpoint: { max: 1024, min: 640 }, items: 3 },
    mobile: { breakpoint: { max: 640, min: 0 }, items: 2 },
  };

  const CustomLeftArrow = ({ onClick }) => {
    return (
      <button
        onClick={onClick}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
      >
        <FaChevronLeft className="text-pink-500 text-xl" />
      </button>
    );
  };

  const CustomRightArrow = ({ onClick }) => {
    return (
      <button
        onClick={onClick}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
      >
        <FaChevronRight className="text-pink-500 text-xl" />
      </button>
    );
  };
  return (
    <>
      <Hero />

      <div
        className={`flex flex-col items-center bg-gray-200  pb-10 md:pb-20 relative ${loading ? "min-h-screen" : ""}`}
      >
        {/* <div className="absolute inset-0 bg-[url('/diamondsbg.svg')] bg-cover opacity-40 z-0" /> */}
        {loading ||
          (google_loading && (
            <div className="fixed inset-0 z-50 flex justify-center items-center backdrop-blur-xs bg-white/60">
              <Image
                width={100}
                src={diamond}
                alt="Loading"
                className="animate-bounce"
              />
            </div>
          ))}
        <div
          ref={newProductsRef}
          id="newProducts"
          className={`relative z-10 w-full flex flex-col justify-center items-center px-5 md:px-40 2xl:px-80 pt-8 pb-8 transition-all duration-1000 ease-in-out ${
            showNewProducts
              ? "opacity-100 translate-y-0 duration-500"
              : "opacity-0 translate-y-8"
          }`}
        >
          <PageHeader
            title="NEW PRODUCTS"
            subtitle="Discover the Latest Arrivals and Set the Trend."
          />
          <div className="w-full md:pb-5">
            <Carousel
              responsive={responsive}
              infinite={true}
              autoPlay={true}
              autoPlaySpeed={3000}
              arrows={false}
              showDots={true}
              renderDotsOutside={true}
              itemClass="px-2"
              containerClass="gap-0"
            >
              {newProducts?.map((item) => (
                <div
                  key={item?.id}
                  className="w-[270px] h-[400px] sm:w-[300px] sm:h-[420px] md:w-[330px] md:h-[450px] 2xl:w-[470px] 2xl:h-[550px] flex flex-col items-center justify-start mx-auto"
                >
                  <Link href={`/customer/product/${item?.id}`}>
                    <img
                      src={item?.images[0]}
                      alt={item?.name}
                      className="w-[270px] h-[280px] sm:w-[300px] sm:h-[300px] md:w-[330px] md:h-[330px] 2xl:w-[470px] 2xl:h-[470px] object-cover rounded-lg"
                      loading="lazy"
                    />
                  </Link>
                  <div className="flex flex-col w-full pt-2">
                    <Link href={`/customer/product/${item?.id}`}>
                      <p className="text-sm sm:text-base md:text-lg md:font-semibold text-gray-800 overflow-hidden">
                        {item?.name}
                      </p>
                    </Link>
                    <div className="flex flex-row justify-around md:justify-between items-center pt-1 mt-1">
                      <Link href={`/customer/product/${item?.id}`}>
                        <div className="flex flex-row gap-2">
                          <p className="text-sm md:text-lg font-serif text-gray-700">
                            {Number(item?.price).toLocaleString("en-NG", {
                              style: "currency",
                              currency: "NGN",
                            })}
                          </p>
                        </div>
                      </Link>
                      <Button
                        className="bg-transparent hover:bg-transparent hover:cursor-pointer hover:animate-pulse"
                        onClick={() => addItemToCart(item?.id)}
                        disabled={addLoadingId === item.id}
                      >
                        {addLoadingId === item.id ? (
                          <div className="w-4 h-4 animate-spin border-2 border-pink-300 border-t-transparent rounded-full" />
                        ) : (
                          <Image
                            src={fastcart}
                            alt="cart-icon"
                            className="size-9"
                          />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </Carousel>
          </div>
          <div className="flex justify-end z-10 w-full mt-10">
            <Link
              className="px-4 py-2 rounded-xl bg-[#FD7DC3] hover:animate-pulse text-white"
              href="/customer/product"
            >
              View All Products
            </Link>
          </div>
        </div>

        <div
          ref={featuredRef}
          className={`relative mt-10 z-10 w-full flex flex-col justify-center items-center px-5 md:px-40 2xl:px-80  transition-all duration-1000 ease-in-out ${
            showFeatured
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
          id="featuredProducts"
        >
          <PageHeader
            title="FEATURED PRODUCTS"
            subtitle="Handpicked Just for You, Elevate Your Style."
          />

          <div className="w-full">
            <Carousel
              responsive={FeaturedResponsive}
              arrows={true}
              itemClass="px-2"
              containerClass="gap-0"
              customLeftArrow={<CustomLeftArrow />}
              customRightArrow={<CustomRightArrow />}
            >
              {featuredProducts?.map((item) => (
                <div
                  key={item?.id}
                  className="flex flex-col bg-gradient-to-b from-white to-[#FFB6C1] bg-opacity-30 py-2 px-2 rounded-lg 
                  w-[180px] h-[300px] 
                 md:w-[250px] md:h-[380px]
                  2xl:w-[370px] 2xl:h-[500px] 
                  mx-auto"
                  style={{
                    background:
                      "linear-gradient(to bottom, white 70%, rgba(255, 182, 193, 0.4) 100%)",
                  }}
                >
                  <Link href={`/customer/product/${item?.id}`}>
                    <img
                      src={item?.images[0]}
                      alt="product-image"
                      className="w-[170px] h-[170px] 
  md:w-[250px] md:h-[250px]
    2xl:w-[370px] 2xl:h-[370px] 
    object-cover rounded-lg"
                      loading="lazy"
                    />
                  </Link>

                  <div className="flex flex-col w-full pt-2">
                    <Link href={`/customer/product/${item?.id}`}>
                      <p className="text-sm md:text-lg md:font-semibold text-gray-800 h-[56px] overflow-hidden">
                        {item?.name}
                      </p>
                    </Link>
                    <div className="flex felx-row justify-between items-center mt-3">
                      <Link href={`/customer/product/${item?.id}`}>
                        <div className="flex flex-row items-center gap-2">
                          <Image
                            src={naira}
                            alt="naira-icon"
                            className="size-10"
                          />
                          <p className="text-sm md:text-lg font-bold text-gray-700">
                            {Number(item?.price).toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </p>
                        </div>
                      </Link>
                      <button
                        className="bg-transparent"
                        onClick={() => addItemToCart(item?.id)}
                        disabled={addLoadingId === item.id}
                      >
                        {addLoadingId === item?.id ? (
                          <div className="w-4 h-4 animate-spin border-2 border-pink-300 border-t-transparent rounded-full" />
                        ) : (
                          <FaCartArrowDown
                            size={35}
                            className="hover:cursor-pointer hover:animate-pulse"
                          />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </Carousel>

            <div className="flex justify-end z-10 w-full mt-10">
              <Link
                className="px-4 py-2 rounded-xl bg-[#FD7DC3] hover:animate-pulse text-white"
                href="/customer/product"
              >
                View All Products
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="w-full flex flex-col items-center pt-10"> */}
      <CustomCarousel />
      {/* </div> */}
      <TextSection />
      <VideoSection />
    </>
  );
};

export default page;
