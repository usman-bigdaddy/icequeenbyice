import { FiCheck } from "react-icons/fi";
import usePaystackScript from "./usePayStackScript";

const PaystackButton = ({ email, amount, onSuccess, onClose }) => {
  const isScriptLoaded = usePaystackScript();

  const payWithPaystack = () => {
    if (!isScriptLoaded || !window.PaystackPop) {
      console.error("Paystack script not ready.");
      return;
    }

    const handler = window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email,
      amount: amount * 100,
      currency: "NGN",
      callback: onSuccess,
      onClose: onClose,
    });

    handler.openIframe();
  };

  return (
    <button
      type="submit"
      onClick={payWithPaystack}
      disabled={!isScriptLoaded}
      className="px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-400 text-white rounded-full hover:shadow-lg transition-all duration-300 flex items-center group"
    >
      Complete Payment
      <FiCheck className="ml-2" />
    </button>
  );
};

export default PaystackButton;
