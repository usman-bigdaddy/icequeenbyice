// app/checkout/page.js
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  FiChevronLeft,
  FiChevronRight,
  FiMapPin,
  FiCreditCard,
  FiCheck,
  FiShoppingBag,
} from "react-icons/fi";
import Image from "next/image";
import diamond from "@/assets/diamond.png";
import { useSelector, useDispatch } from "react-redux";
import PaystackButton from "@/_components/payment/paystackButton";
import { toast } from "react-toastify";

const CheckoutPage = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [deliveryLocations, setDeliveryLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const [formData, setFormData] = useState({
    receiverName: "",
    receiverNumber: "",
    fullAddress: "",
    locationId: "",
    note: "",
  });

  // Load cart data from sessionStorage
  useEffect(() => {
    const checkoutData = sessionStorage.getItem("checkoutData");
    if (!checkoutData) {
      router.push("/customer/cart");
      return;
    }

    const { cartItems, totalAmount } = JSON.parse(checkoutData);
    setCartItems(cartItems);
    setTotalAmount(totalAmount);

    // Fetch delivery locations
    const fetchDeliveryLocations = async () => {
      try {
        const { data } = await axios.get("/api/deliveryFees");
        setDeliveryLocations(data);
      } catch (error) {
        console.error("Error fetching delivery locations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveryLocations();
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const selectedLocation = deliveryLocations.find(
    (loc) => loc.id === formData.locationId
  );
  const deliveryFee = selectedLocation?.fee || 0;
  const grandTotal = totalAmount + deliveryFee;
  const submitOrder = async () => {
    setPaymentLoading(true);
    try {
      const simplifiedCartItems = cartItems.map((item) => ({
        productId: item.product.id,
        price: item.product.price,
        quantity: item.quantity,
      }));

      await axios.post("/api/checkout", {
        ...formData,
        fee: deliveryFee,
        cartItems: simplifiedCartItems,
        userId: user?.id,
        totalAmount: grandTotal,
      });

      sessionStorage.removeItem("checkoutData");
      router.push(`/customer/home`);
      toast.success("Order placed successfully!");
    } catch (error) {
      console.error("Order submission failed:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (step === 1) {
      setStep(2);
    }
  };

  if (loading || paymentLoading || !cartItems.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <div className="animate-pulse flex flex-col items-center">
          <Image width={80} src={diamond} alt="Loading" className="mb-4" />
          <p className="text-gray-600">Preparing your checkout experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-pink-50">
      <div className="container mx-auto px-4 py-12 md:px-8 lg:px-16 relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center mb-12">
          <div className="flex items-center justify-center space-x-6 mb-4">
            <Image
              width={40}
              src={diamond}
              alt="diamond"
              className="animate-pulse"
            />
            <h1 className="text-3xl font-serif tracking-widest text-gray-800">
              CHECKOUT
            </h1>
            <Image
              width={40}
              src={diamond}
              alt="diamond"
              className="animate-pulse"
            />
          </div>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-pink-300 to-transparent mb-2"></div>
          <p className="text-sm text-gray-500 font-light">
            Complete your purchase with elegance
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center">
            <div
              className={`flex flex-col items-center ${step >= 1 ? "text-pink-500" : "text-gray-400"}`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? "bg-pink-100 border border-pink-300" : "bg-gray-100"}`}
              >
                {step > 1 ? <FiCheck className="w-5 h-5" /> : <span>1</span>}
              </div>
              <span className="mt-2 text-sm">Shipping</span>
            </div>

            <div
              className={`flex-1 h-0.5 mx-4 w-16 ${step >= 2 ? "bg-pink-300" : "bg-gray-200"}`}
            ></div>

            <div
              className={`flex flex-col items-center ${step >= 2 ? "text-pink-500" : "text-gray-400"}`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? "bg-pink-100 border border-pink-300" : "bg-gray-100"}`}
              >
                <span>2</span>
              </div>
              <span className="mt-2 text-sm">Payment</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Checkout Form */}
          <div className="lg:w-2/3">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-xl shadow-sm overflow-hidden border border-pink-100 p-6 md:p-8"
            >
              {step === 1 ? (
                <>
                  <h2 className="text-xl font-serif text-gray-800 mb-6 flex items-center">
                    <FiMapPin className="text-pink-400 mr-2" /> Shipping
                    Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-600 text-sm mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        placeholder="Enter Full Name of Recevier"
                        name="receiverName"
                        value={formData.receiverName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 text-sm mb-2">
                        Phone Number
                      </label>
                      <input
                        name="receiverNumber"
                        placeholder="Enter Phone Number of Recevier"
                        value={formData.receiverNumber}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-gray-600 text-sm mb-2">
                        Delivery Location
                      </label>
                      <select
                        name="locationId"
                        value={formData.locationId}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+')] bg-no-repeat bg-[center_right_1rem]"
                      >
                        <option value="">Select your location</option>
                        {deliveryLocations.map((location) => (
                          <option key={location.id} value={location.id}>
                            {location.location} (₦
                            {location.fee.toLocaleString()})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-gray-600 text-sm mb-2">
                        Address
                      </label>
                      <input
                        type="text"
                        name="fullAddress"
                        placeholder="Enter Full Addrress"
                        value={formData.fullAddress}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-gray-600 text-sm mb-2">
                        Order Notes (Optional)
                      </label>
                      <textarea
                        name="note"
                        value={formData.note}
                        onChange={handleChange}
                        rows="3"
                        className="w-full px-4 py-3 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all"
                        placeholder="Special delivery instructions, gift notes, etc."
                      ></textarea>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-serif text-gray-800 mb-6 flex items-center">
                    <FiCreditCard className="text-pink-400 mr-2" /> Payment
                    Method
                  </h2>

                  <div className="space-y-6">
                    <div className="p-4 border-2 border-pink-300 rounded-xl bg-pink-50">
                      <div className="flex items-center">
                        <div className="w-5 h-5 rounded-full border-2 border-pink-400 bg-pink-400 flex items-center justify-center mr-3">
                          <FiCheck className="text-white w-3 h-3" />
                        </div>
                        <div>
                          <h3 className="font-medium">Pay with Paystack</h3>
                          <p className="text-sm text-gray-600">
                            Secure payment with cards, bank transfer, or USSD
                          </p>
                        </div>
                        <div className="ml-auto">
                          <div className="bg-black text-white px-3 py-1 rounded-md text-xs font-medium">
                            RECOMMENDED
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-pink-50 p-6 rounded-xl border border-pink-100">
                      <h3 className="font-medium text-gray-800 mb-4">
                        Order Summary
                      </h3>
                      <div className="space-y-4">
                        {cartItems.map((item) => (
                          <div
                            key={item.cartId}
                            className="flex justify-between items-center"
                          >
                            <div className="flex items-center">
                              <div className="relative w-12 h-12 rounded-md overflow-hidden mr-4">
                                <Image
                                  src={item.product.images[0]}
                                  fill
                                  className="object-cover"
                                  alt={item.product.name}
                                />
                              </div>
                              <span className="text-gray-700">
                                {item.product.name} × {item.quantity}
                              </span>
                            </div>
                            <span className="font-medium">
                              ₦
                              {(
                                item.product.price * item.quantity
                              ).toLocaleString()}
                            </span>
                          </div>
                        ))}
                        <div className="flex justify-between pt-4 border-t border-pink-100">
                          <span className="text-gray-600">Subtotal</span>
                          <span>₦{totalAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Delivery</span>
                          <span>₦{deliveryFee.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between font-medium text-lg pt-4 border-t border-pink-100">
                          <span>Total</span>
                          <span className="text-pink-500">
                            ₦{grandTotal.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="flex justify-between mt-8 pt-6 border-t border-pink-100">
                {step === 1 ? (
                  <button
                    type="button"
                    onClick={() => router.push("/customer/cart")}
                    className="flex items-center text-pink-500 hover:text-pink-600 transition-colors px-4 py-2 rounded-lg"
                  >
                    <FiChevronLeft className="mr-1" /> Back to Cart
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex items-center text-pink-500 hover:text-pink-600 transition-colors px-4 py-2 rounded-lg"
                  >
                    <FiChevronLeft className="mr-1" /> Back to Shipping
                  </button>
                )}
                {step === 1 ? (
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-400 text-white rounded-full hover:shadow-lg transition-all duration-300 flex items-center group"
                  >
                    Continue to Payment
                    <FiChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                ) : (
                  <PaystackButton
                    email={isAuthenticated && user?.email}
                    amount={grandTotal}
                    onSuccess={() => {
                      submitOrder();
                    }}
                    onClose={() => {
                      toast.info(
                        "You closed the payment window. Payment was not completed."
                      );
                    }}
                  />
                )}
              </div>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-pink-100 sticky top-8">
              <div className="p-6">
                <h2 className="text-lg font-serif text-gray-800 mb-4">
                  Your Order
                </h2>
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  {cartItems.map((item) => (
                    <div
                      key={item.cartId}
                      className="flex items-center py-3 border-b border-pink-50 last:border-0"
                    >
                      <div className="relative w-16 h-16 rounded-md overflow-hidden mr-4">
                        <Image
                          src={item.product.images[0]}
                          fill
                          className="object-cover"
                          alt={item.product.name}
                        />
                        <span className="absolute top-1 right-1 bg-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-sm">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-gray-800 font-medium">
                          {item.product.name}
                        </h3>
                        <p className="text-pink-500 text-sm">
                          ₦{item.product.price.toLocaleString()} ×{" "}
                          {item.quantity}
                        </p>
                        {item.product.size && (
                          <p className="text-gray-500 text-xs mt-1">
                            Size: {item.product.size}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-pink-100 mt-4 pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>₦{totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery</span>
                    <span>
                      {formData.locationId
                        ? `₦${deliveryFee.toLocaleString()}`
                        : "--"}
                    </span>
                  </div>
                  <div className="flex justify-between font-medium text-lg mt-2 pt-2 border-t border-pink-100">
                    <span>Total</span>
                    <span className="text-pink-500">
                      {formData.locationId
                        ? `₦${grandTotal.toLocaleString()}`
                        : "--"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
