// components/dashboard/RecentOrdersTable.jsx
import Link from "next/link";
import { EyeIcon } from "@heroicons/react/outline";

export default function RecentOrdersTable({ orders }) {
  const statusColors = {
    PENDING: "bg-yellow-100 text-yellow-800",
    SHIPPED: "bg-blue-100 text-blue-800",
    DELIVERED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-pink-200">
        <thead className="bg-pink-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-pink-500 uppercase tracking-wider">
              Order ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-pink-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-pink-500 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-pink-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-pink-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-pink-200">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-pink-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-pink-900">
                {order.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[order.status]}`}
                >
                  {order.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-pink-900">
                ₦{order.amount}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-pink-500">
                {new Date(order.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="text-pink-600 hover:text-pink-900 inline-flex items-center"
                >
                  <EyeIcon className="h-4 w-4 mr-1" />
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
