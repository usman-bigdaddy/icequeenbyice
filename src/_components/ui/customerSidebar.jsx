import { IoMdClose } from "react-icons/io";
import Link from "next/link";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import { get_all_products } from "@/store/customer/products/products-slice";
import { loginWithGoogle } from "@/store/admin-auth/admin-auth-slice";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useGoogleLogin } from "@react-oauth/google";

const CustomerSideBar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleLoginWithGoogle = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const { access_token } = response;

        dispatch(loginWithGoogle(access_token));
      } catch (err) {
        console.error("Google login failed:", err);
      }
    },
    onError: (error) => {
      console.error("Google login error:", error);
    },
  });

  const router = useRouter();

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    router.push("/customer/home");
    dispatch(get_all_products());
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-3/4 sm:w-1/2 bg-white z-[999] shadow-lg transform transition-transform duration-500 ease-in-out ${
        isSidebarOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="p-6 flex flex-col gap-6 text-black font-semibold">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-bold text-[#DE0D6F]">Menu</span>
          <IoMdClose
            size={24}
            onClick={() => setIsSidebarOpen(false)}
            className="cursor-pointer text-gray-700"
          />
        </div>
        <Link href="/customer/home" onClick={() => setIsSidebarOpen(false)}>
          Home
        </Link>
        <Link href="/customer/product" onClick={() => setIsSidebarOpen(false)}>
          Products
        </Link>
        <Link href="/customer/cart" onClick={() => setIsSidebarOpen(false)}>
          Cart
        </Link>
        {isAuthenticated && (
          <Link
            href="/customer/myorders"
            onClick={() => setIsSidebarOpen(false)}
          >
            My Orders
          </Link>
        )}
        <Link href="/customer/about" onClick={() => setIsSidebarOpen(false)}>
          About Us
        </Link>
        <Link href="/customer/contact" onClick={() => setIsSidebarOpen(false)}>
          Contact Us
        </Link>
        {isAuthenticated ? (
          <Link
            href="/customer/product"
            className="flex gap-2 items-center bg-[#DE0D6F] text-white py-2 px-4 rounded-full mt-4"
          >
            <AiOutlineShoppingCart />
            Shop Now
          </Link>
        ) : (
          <Button
            onClick={handleLoginWithGoogle}
            className=" bg-[#DE0D6F] text-white py-2 px-4 rounded-full mt-4"
          >
            Sign In
          </Button>
        )}

        {isAuthenticated && (
          <Button
            onClick={handleLogout}
            className=" bg-[#DE0D6F] text-white py-2 px-4 rounded-full mt-1"
          >
            Logout
          </Button>
        )}
      </div>
    </div>
  );
};

export default CustomerSideBar;
