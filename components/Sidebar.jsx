import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";

export default function Sidebar() {
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("token");
    toast.success("Logged out successfully!");
    router.push("/admin/login");
  };

  return (
    <div className="w-64 h-full relative p-5 shadow-lg overflow-hidden bg-gradient-to-br from-rose-900 via-purple-800 to-gray-400 text-white">
      {/* Sparkling Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.1)_0%,rgba(0,0,0,0)_70%)] opacity-50 animate-[pulse_3s_infinite] pointer-events-none"></div>

      <h2 className="text-2xl font-bold mb-6 text-white drop-shadow-md animate-[pulse_2s_infinite]">
        ✨ Menu
      </h2>

      <ul className="space-y-4">
        <li>
          <Link
            href="/admin"
            className="flex items-center gap-2 transition duration-300 hover:text-gray-200 hover:shadow-[0_0_10px_rgba(255,255,255,0.6)]"
          >
            🏠 Dashboard
          </Link>
        </li>
        <li>
          <Link
            href="/admin/add-user"
            className="flex items-center gap-2 transition duration-300 hover:text-gray-200 hover:shadow-[0_0_10px_rgba(255,255,255,0.6)]"
          >
            👤Add Users
          </Link>
        </li>{" "}
        <li>
          <Link
            href="/admin/users"
            className="flex items-center gap-2 transition duration-300 hover:text-gray-200 hover:shadow-[0_0_10px_rgba(255,255,255,0.6)]"
          >
            👤 Users
          </Link>
        </li>
        <li>
          <Link
            href="/admin/add-products"
            className="flex items-center gap-2 transition duration-300 hover:text-gray-200 hover:shadow-[0_0_10px_rgba(255,255,255,0.6)]"
          >
            📦 Add Products
          </Link>
        </li>{" "}
        <li>
          <Link
            href="/admin/products"
            className="flex items-center gap-2 transition duration-300 hover:text-gray-200 hover:shadow-[0_0_10px_rgba(255,255,255,0.6)]"
          >
            📦 View Products
          </Link>
        </li>
        <li>
          <Link
            href="/admin/orders"
            className="flex items-center gap-2 transition duration-300 hover:text-gray-200 hover:shadow-[0_0_10px_rgba(255,255,255,0.6)]"
          >
            📦 Orders
          </Link>
        </li>
        <li>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 transition duration-300 hover:text-gray-200 hover:shadow-[0_0_10px_rgba(255,255,255,0.6)]"
          >
            ⚙ Logout
          </button>
        </li>
      </ul>
    </div>
  );
}
