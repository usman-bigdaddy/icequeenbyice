"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { RxCross2 } from "react-icons/rx";
import { FiPlus, FiMinus, FiShoppingBag, FiTrash2 } from "react-icons/fi";
import Image from "next/image";
import DiamondLoader from "@/components/ui/DiamondLoader";
import PageHeader from "@/components/ui/PageHeader";
import { useRouter } from "next/navigation";
import { getGuestId } from "@/utils/getGeustId";
import { useSelector, useDispatch } from "react-redux";
import { loginWithGoogle } from "@/store/admin-auth/admin-auth-slice";
import { useGoogleLogin } from "@react-oauth/google";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { AiOutlineUser } from "react-icons/ai";
import diamond from "@/assets/diamond.png";
import Link from "next/link";

const CartPage = () => {
  // const [isGuest, setIsGuest] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingItemId, setRemovingItemId] = useState(null);
  const [clearCartLaoding, setClearCartLaoding] = useState(false);
  const [subtotal, setSubtotal] = useState(0);
  const [quantityUpdates, setQuantityUpdates] = useState({});
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user, google_loading } = useSelector(
    (state) => state.auth
  );

  const userId = isAuthenticated ? user?.id : null;
  const guestId = !isAuthenticated ? getGuestId() : null;

  const userOrGuestId = isAuthenticated ? userId : guestId;

  const router = useRouter();
  // Fetch cart data
  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        let response;

        if (isAuthenticated && userOrGuestId) {
          response = await axios.get(`/api/cart?userId=${userOrGuestId}`);
        } else {
          response = await axios.get(`/api/cart?guestId=${userOrGuestId}`);
        }

        const data = response.data;
        setCartItems(data);
        calculateSubtotal(data);
      } catch (error) {
        console.error("Failed to fetch cart:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  // Debounced quantity updates
  const handleCheckoutButton = () => {
    // Save cart data to sessionStorage (automatically clears when tab closes)
    sessionStorage.setItem(
      "checkoutData",
      JSON.stringify({
        cartItems,
        totalAmount: subtotal,
      })
    );
    router.push("/customer/checkout");
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      Object.entries(quantityUpdates).forEach(async ([productId, quantity]) => {
        try {
          await axios.post("/api/cart", {
            productId,
            quantity,
            ...(isAuthenticated && userOrGuestId
              ? { userId: userOrGuestId }
              : { guestId: userOrGuestId }),
          });
        } catch (error) {
          console.error("Failed to update quantity:", error);
        }
      });
      setQuantityUpdates({});
    }, 1000);

    return () => clearTimeout(timer);
  }, [quantityUpdates]);

  const calculateSubtotal = (items) => {
    const total = items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    setSubtotal(total);
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return;

    const updatedItems = cartItems.map((item) =>
      item.product.id === productId ? { ...item, quantity: newQuantity } : item
    );

    setCartItems(updatedItems);
    calculateSubtotal(updatedItems);
    setQuantityUpdates((prev) => ({ ...prev, [productId]: newQuantity }));
  };

  const removeItem = async (productId) => {
    const confirmMsg =
      "Whoa there! Are you sure you want to kick this item out of the cart?";

    if (!window.confirm(confirmMsg)) return;

    setRemovingItemId(productId);
    try {
      const payload = {
        productId,
        ...(isAuthenticated && userOrGuestId
          ? { userId: userOrGuestId }
          : { guestId: userOrGuestId }),
      };

      await axios.delete("/api/cart/item", {
        data: payload,
      });

      const updatedItems = cartItems.filter(
        (item) => item.product.id !== productId
      );

      setCartItems(updatedItems);
      calculateSubtotal(updatedItems);
    } catch (error) {
      console.error("Failed to remove item:", error);
    } finally {
      setRemovingItemId(null);
    }
  };
  const dispatch = useDispatch();

  const handleLoginWithGoogle = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const { access_token } = response;

        dispatch(loginWithGoogle(access_token));
        if (!google_loading) {
          router.push("/customer/checkout");
        }
      } catch (err) {
        console.error("Google login failed:", err);
      }
    },
    onError: (error) => {
      console.error("Google login error:", error);
    },
  });

  const clearCart = async () => {
    const confirmMsg =
      "ohh nooo! 😢 did we do something wrong?...you really want to clear your cart?";

    if (!window.confirm(confirmMsg)) return;

    setClearCartLaoding(true);
    try {
      const payload =
        isAuthenticated && userOrGuestId
          ? { userId: userOrGuestId }
          : { guestId: userOrGuestId };

      await axios.delete("/api/cart", {
        data: payload,
      });

      setCartItems([]);
      setSubtotal(0);
    } catch (error) {
      console.error("Failed to clear cart:", error);
    } finally {
      setClearCartLaoding(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    })
      .format(price)
      .replace("NGN", "₦");
  };

  if (loading) {
    return <DiamondLoader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-pink-50">
      <div className="container mx-auto px-4 py-12 md:px-8 lg:px-16 relative z-10">
        {/* Header */}
        <PageHeader
          title="My Cart"
          subtitle="Your Perfect Selections Are Waiting for Checkout."
        />

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            {cartItems.length > 0 ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-serif text-xl text-gray-700">
                    {totalItems} {totalItems === 1 ? "Item" : "Items"} in your
                    cart
                  </h2>
                  <button
                    onClick={clearCart}
                    disabled={clearCartLaoding}
                    className={`text-pink-500 hover:text-pink-600 flex items-center text-sm transition-opacity
    ${clearCartLaoding ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {clearCartLaoding ? (
                      <div className="w-4 h-4 mr-2 animate-spin border-2 border-pink-400 border-t-transparent rounded-full" />
                    ) : (
                      <FiTrash2 className="mr-1" />
                    )}
                    {clearCartLaoding ? "Clearing..." : "Clear Cart"}
                  </button>

                  {!isAuthenticated && (
                    <button
                      onClick={handleLoginWithGoogle}
                      className="md:hidden text-pink-500 hover:text-pink-600 flex items-center text-sm"
                    >
                      signin
                    </button>
                  )}
                </div>

                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <div
                      key={item.cartId}
                      className="bg-white rounded-xl shadow-sm overflow-hidden border border-pink-100 hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex flex-col md:flex-row">
                        {/* Product Image */}
                        <div className="md:w-1/3 relative h-64 md:h-auto">
                          <Image
                            src={
                              item.product.images[0] ||
                              "/placeholder-product.jpg"
                            }
                            fill
                            className="object-cover"
                            alt={item.product.name}
                            onError={(e) =>
                              (e.target.src = "/placeholder-product.jpg")
                            }
                          />
                          <button
                            onClick={() => removeItem(item.product.id)}
                            disabled={removingItemId === item.product.id}
                            className={`absolute top-4 right-4 bg-white rounded-full p-2 shadow-md transition-colors
    ${removingItemId === item.product.id ? "opacity-50 cursor-not-allowed" : "hover:bg-pink-50"}`}
                          >
                            {removingItemId === item.product.id ? (
                              <div className="w-4 h-4 animate-spin border-2 border-pink-300 border-t-transparent rounded-full" />
                            ) : (
                              <RxCross2 className="w-4 h-4 text-pink-400" />
                            )}
                          </button>
                        </div>

                        {/* Product Details */}
                        <div className="md:w-2/3 p-6 flex flex-col">
                          <div className="flex-1">
                            <h3 className="font-serif text-xl text-gray-800 mb-2">
                              {item.product.name}
                            </h3>
                            <p className="text-gray-500 text-sm mb-4">
                              {item.product.fabricType} • Size:{" "}
                              {item.product.size}
                            </p>
                            <div className="flex items-center space-x-4 mb-6">
                              <span className="text-pink-500 font-medium">
                                {formatPrice(item.product.price)}
                              </span>
                            </div>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between border-t border-pink-100 pt-4">
                            <div className="flex items-center border border-pink-200 rounded-full">
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item.product.id,
                                    item.quantity - 1
                                  )
                                }
                                disabled={item.quantity === 1}
                                className={`p-2 ${item.quantity === 1 ? "text-gray-300" : "text-pink-500 hover:bg-pink-50"}`}
                              >
                                <FiMinus className="w-4 h-4" />
                              </button>
                              <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) =>
                                  handleQuantityChange(
                                    item.product.id,
                                    parseInt(e.target.value) || 1
                                  )
                                }
                                className="w-12 text-center border-none bg-transparent focus:outline-none [&::-webkit-inner-spin-button]:appearance-none"
                              />
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item.product.id,
                                    item.quantity + 1
                                  )
                                }
                                className="p-2 text-pink-500 hover:bg-pink-50"
                              >
                                <FiPlus className="w-4 h-4" />
                              </button>
                            </div>
                            <span className="text-gray-800 font-medium">
                              {formatPrice(item.product.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Continue Shopping Card */}
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-pink-100 hover:shadow-md transition-all duration-300">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/3 relative h-64 md:h-auto bg-gradient-to-br from-pink-50 to-white flex items-center justify-center">
                        <div className="text-center p-6">
                          <FiShoppingBag className="w-12 h-12 text-pink-300 mx-auto mb-4" />
                          <p className="text-gray-500">
                            Add another beautiful piece
                          </p>
                        </div>
                      </div>
                      <div className="md:w-2/3 p-6 flex flex-col justify-center items-center text-center">
                        <h3 className="font-serif text-xl text-gray-800 mb-2">
                          Your Cart Desires More
                        </h3>
                        <p className="text-gray-500 mb-6 max-w-md">
                          Complete your look with our curated collection of
                          outfits
                        </p>
                        <button className="px-6 py-3 border border-pink-300 text-pink-500 rounded-full hover:bg-pink-50 transition-colors">
                          <Link href="/customer/product" passHref>
                            Browse New Arrivals
                          </Link>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="w-full bg-white rounded-xl shadow-sm overflow-hidden border border-pink-100 p-12 text-center">
                <FiShoppingBag className="w-12 h-12 text-pink-300 mx-auto mb-4" />
                <h3 className="font-serif text-xl text-gray-800 mb-2">
                  Your Cart is Empty
                </h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Discover our collection and add some elegant pieces
                </p>
                <button className="px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-400 text-white rounded-full hover:shadow-lg transition-all duration-300">
                  Browse Collections
                </button>
              </div>
            )}
          </div>

          {/* Order Summary */}
          {cartItems.length > 0 && (
            <div className="lg:w-1/3 sticky top-8">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-pink-100">
                <div className="bg-gradient-to-r from-pink-500 to-pink-400 px-6 py-5">
                  <h2 className="text-white font-serif text-xl tracking-wider">
                    ORDER SUMMARY
                  </h2>
                </div>
                <div className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-light">Subtotal</span>
                      <span className="text-gray-800">
                        {formatPrice(subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-light">Delivery</span>
                      <span className="text-pink-500">Based on Location</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-light">Discount</span>
                      <span className="text-gray-400">---</span>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-pink-100 flex justify-between items-center">
                    <span className="text-gray-800 font-medium">Total</span>
                    <span className="text-pink-500 font-serif text-xl">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  {isAuthenticated ? (
                    <button
                      onClick={handleCheckoutButton}
                      className="w-full py-4 bg-gradient-to-r from-pink-500 to-pink-400 hover:from-pink-600 hover:to-pink-500 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <span className="tracking-wider">
                        PROCEED TO CHECKOUT
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  ) : (
                    <Dialog open={open} onOpenChange={setOpen}>
                      <DialogTrigger asChild>
                        <button className="w-full py-4 bg-gradient-to-r from-pink-500 to-pink-400 hover:from-pink-600 hover:to-pink-500 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2">
                          {google_loading ? (
                            <div className="w-4 h-4 animate-spin border-2 border-pink-300 border-t-transparent rounded-full" />
                          ) : (
                            <>
                              <span className="tracking-wider">
                                PROCEED TO CHECKOUT
                              </span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </>
                          )}
                        </button>
                      </DialogTrigger>

                      <DialogContent className="sm:max-w-md rounded-xl shadow-lg">
                        <DialogHeader>
                          <div className="flex items-center gap-2 mb-2">
                            <AiOutlineUser className="text-2xl  text-pink-500" />
                            <DialogTitle className="text-lg font-semibold text-gray-800">
                              Kindly Sign In
                            </DialogTitle>
                          </div>
                        </DialogHeader>

                        <p className="text-base text-gray-600 mb-4">
                          You need to be signed in to proceed to checkout.
                        </p>

                        <DialogFooter>
                          <button
                            onClick={() => {
                              setOpen(false);
                              handleLoginWithGoogle();
                            }}
                            className="w-full py-2 bg-gradient-to-r from-pink-500 to-pink-400 hover:from-pink-600 hover:to-pink-500 text-white rounded-full shadow-md "
                          >
                            Sign In
                          </button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;
