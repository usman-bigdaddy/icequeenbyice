"use client";
import Image from "next/image";
import img from "@/assets/card.jpg";
import img2 from "@/assets/R.jpg";
import { useState, useEffect } from "react";
import Link from "next/link";
import { LiaShippingFastSolid } from "react-icons/lia";
import { TbRotate3D } from "react-icons/tb";
import { IoIosArrowForward } from "react-icons/io";
import SuggestedProducts from "@/_components/ui/suggestedProducts";
import useInView from "@/hooks/useInView";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { get_single_product } from "@/store/customer/products/products-slice";
import { useSession } from "next-auth/react";
import { getGuestId } from "@/utils/getGeustId";
import { addToCart } from "@/store/customer/cart/cart-slice";
import diamond from "@/assets/diamond.png";

const page = () => {
  const [count, setCount] = useState(1);
  const { id } = useParams();
  const { singleProduct, loading } = useSelector(
    (state) => state.customerProducts
  );
  const dispatch = useDispatch();
  const [selectedImg, setSelectedImg] = useState(null);
  const { addLoadingId } = useSelector((state) => state.cart);

  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const userId = isAuthenticated ? user?.id : null;
  const guestId = !isAuthenticated ? getGuestId() : null;

  const addItemToCart = (productId) => {
    const userOrGuestId = isLoggedIn ? userId : guestId;
    const quantity = count;
    const payload = {
      productId,
      quantity,
    };

    if (isLoggedIn && userOrGuestId) {
      payload.userId = userOrGuestId;
    } else if (!isLoggedIn && userOrGuestId) {
      payload.guestId = userOrGuestId;
    }
    dispatch(addToCart(payload));
  };

  useEffect(() => {
    if (!loading && singleProduct?.images?.length > 0) {
      setSelectedImg(singleProduct.images[0]);
    }
  }, [loading, singleProduct]);

  const increment = () => {
    setCount((prev) => prev + 1);
  };

  const decrement = () => {
    setCount((prev) => {
      if (prev === 1) {
        return 1;
      } else {
        return prev - 1;
      }
    });
  };

  useEffect(() => {
    if (id) {
      dispatch(get_single_product(id));
    }
  }, [dispatch, id]);

  const { ref: productRef, isVisible: showProduct } = useInView();
  const { ref: linkRef, isVisible: showLink } = useInView();

  return (
    <>
      <div
        key={id}
        className="relative px-4 md:px-40 2xl:px-80 flex flex-col py-4 md:py-7 bg-gray-100 min-h-screen"
      >
        {loading && (
          <div className="fixed inset-0 z-50 flex justify-center items-center backdrop-blur-xs bg-white/60">
            <Image
              width={100}
              src={diamond}
              alt="Loading"
              className="animate-bounce"
            />
          </div>
        )}

        <div
          ref={linkRef}
          className={`flex flex-wrap items-center gap-1 mb-5 transition-all duration-500 ease-in-out ${
            showLink ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
          }`}
        >
          <Link
            href="/customer/product"
            className="text-[#7B7B7B] text-sm font-normal"
          >
            Product Listing
          </Link>
          <IoIosArrowForward className="size-5 text-[#7B7B7B]" />
          <p className="text-[#414141] text-sm font-normal">
            {singleProduct?.name}
          </p>
        </div>

        <div
          ref={productRef}
          className={`flex flex-col md:flex-row justify-between gap-8 w-full transition-all duration-700 ease-in-out ${
            showProduct
              ? "opacity-100 translate-y-0"
              : "opacity-100 translate-y-0"
          }`}
        >
          <div className="flex flex-col md:flex-row w-full md:w-1/2 items-center gap-4">
            <div className="flex flex-row md:flex-col w-full md:w-[25%] gap-2 md:h-[400px] overflow-y-auto">
              {singleProduct?.images.map((imgSrc, i) => (
                <img
                  key={i}
                  src={imgSrc}
                  alt="product"
                  className="h-[80px] w-[80px] md:h-[33.3%] md:w-full object-cover rounded-md"
                  onClick={() => setSelectedImg(imgSrc)}
                  loading="lazy"
                />
              ))}
            </div>
            <div className="w-full md:w-[75%] rounded-md">
              <img
                src={selectedImg || singleProduct?.images[0]}
                alt="selected-product"
                className="w-full h-[300px] md:h-full object-cover rounded-md"
                loading="lazy"
              />
            </div>
          </div>

          <div className="flex flex-col w-full md:w-1/2 z-10">
            <h1 className="text-[#2D2D2D] text-xl md:text-2xl font-semibold mb-2">
              {singleProduct?.name}
            </h1>
            <h2 className="text-[#414141] text-lg md:text-2xl font-medium mb-4">
              {Number(singleProduct?.price).toLocaleString("en-NG", {
                style: "currency",
                currency: "NGN",
              })}
            </h2>
            <p className="text-[#414141] text-sm mb-1">
              {singleProduct?.description}
            </p>
            <p className="text-[#414141] text-sm mb-4">
              Fabric Type: {singleProduct?.fabricType}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
              <div className="flex flex-row justify-center items-center gap-4 px-4 py-2 w-full sm:w-[40%] bg-white rounded-3xl">
                <button
                  onClick={decrement}
                  className={`hover:cursor-pointer text-lg ${count === 1 && "text-gray-300"}`}
                >
                  -
                </button>
                <p>{count}</p>
                <button
                  onClick={increment}
                  className="hover:cursor-pointer text-lg"
                >
                  +
                </button>
              </div>

              <button
                className="w-full sm:w-[60%] bg-[#DE0D6F] py-2 text-white rounded-3xl flex items-center justify-center hover:cursor-pointer"
                onClick={() => addItemToCart(singleProduct?.id)}
                disabled={addLoadingId === singleProduct?.id}
              >
                {addLoadingId === singleProduct?.id ? (
                  <div className="w-4 h-4 animate-spin border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <span>Add to Cart</span>
                )}
              </button>
            </div>

            <Link
              href="/customer/cart"
              className="w-full py-2 border border-[#414141] rounded-3xl mt-4 text-center bg-white text-sm"
            >
              View Cart
            </Link>

            <div className="flex flex-row items-start gap-3 mt-4">
              <LiaShippingFastSolid className="size-6 text-[#DE0D6F]" />
              <p className="text-[#414141] text-sm">
                Free worldwide shipping on all orders over N100,000
              </p>
            </div>
            <div className="flex flex-row items-start gap-3 mt-2">
              <TbRotate3D className="size-6 text-[#DE0D6F]" />
              <p className="text-[#414141] text-sm">Delivers in: 1-2 Hours</p>
            </div>
          </div>
        </div>
      </div>

      <SuggestedProducts />
    </>
  );
};

export default page;
