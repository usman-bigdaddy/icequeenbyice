"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useParams } from "next/navigation";
import {
  EyeIcon,
  ChevronRightIcon,
  RefreshIcon,
} from "@heroicons/react/outline";
import DiamondLoader from "@/components/ui/DiamondLoader";

const statusOptions = [
  { value: "ALL", label: "All Orders" },
  { value: "PENDING", label: "Pending" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
];

const page = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        let url = `/api/orders?userId=${id}`;
        if (selectedStatus !== "ALL") {
          url += `&status=${selectedStatus}`;
        }

        const response = await axios.get(url);
        if (response.data.success) {
          setOrders(response.data.data);
        }
      } catch (err) {
        setError(err.message || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [id, selectedStatus]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      PENDING: "bg-pink-100 text-pink-800",
      SHIPPED: "bg-blue-100 text-blue-800",
      DELIVERED: "bg-emerald-100 text-emerald-800",
      CANCELLED: "bg-rose-100 text-rose-800",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[status] || "bg-gray-100"}`}
      >
        {status}
      </span>
    );
  };

  if (loading) {
    return <DiamondLoader />;
  }

  if (error) {
    return (
      <div className="p-4 text-rose-500 bg-rose-50 rounded-lg mx-4">
        Error: {error}
      </div>
    );
  }

  const customerName = orders[0]?.customerDetails?.fullName;
  const customerEmail = orders[0]?.customerDetails?.email;

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex mb-6" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-2">
          <li>
            <div className="flex items-center">
              <Link
                href="/admin/users"
                className="text-sm font-medium text-pink-700 hover:text-pink-900"
              >
                Users
              </Link>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <ChevronRightIcon className="h-4 w-4 text-pink-400 mx-2" />
              <span className="text-sm font-medium text-pink-500">
                {customerName}
              </span>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <ChevronRightIcon className="h-4 w-4 text-pink-400 mx-2" />
              <span className="text-sm font-medium text-pink-900">Orders</span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-6 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-pink-900">
              {orders.length > 0
                ? `${selectedStatus === "ALL" ? "" : selectedStatus.charAt(0) + selectedStatus.slice(1).toLowerCase() + " "}Orders`
                : "Orders"}
            </h2>
            {orders.length > 0 ? (
              <>
                <p className="text-pink-700 mt-1">
                  For <span className="font-medium">{customerName}</span>
                </p>
                <p className="text-pink-700 mt-1">{customerEmail}</p>
              </>
            ) : (
              <p className="text-pink-700 mt-1">No orders found</p>
            )}
          </div>
          <div className="w-full md:w-auto">
            <label htmlFor="status-filter" className="sr-only">
              Filter by status
            </label>
            <select
              id="status-filter"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="block w-full md:w-48 px-4 py-2 border border-pink-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-pink-900 bg-white"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-pink-100 overflow-hidden">
        <Table className="min-w-full divide-y divide-pink-100">
          <TableHeader className="bg-pink-50">
            <TableRow>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-pink-900 uppercase tracking-wider">
                Name of Receiver
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-pink-900 uppercase tracking-wider">
                Delviery Address
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-pink-900 uppercase tracking-wider">
                Total
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-pink-900 uppercase tracking-wider">
                Qty
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-pink-900 uppercase tracking-wider">
                Date
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-pink-900 uppercase tracking-wider">
                Status
              </TableHead>
              <TableHead className="px-6 py-3 text-right text-xs font-medium text-pink-900 uppercase tracking-wider">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white divide-y divide-pink-100">
            {orders.length > 0 ? (
              orders.map((order) => (
                <TableRow
                  key={order.id}
                  className="hover:bg-pink-50 transition-colors"
                >
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-pink-900">
                    {order.shippingDetails.receiverName}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-pink-700 max-w-xs truncate">
                    {order.shippingDetails.fullAddress}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-pink-900">
                    ₦{order.totalAmount.toLocaleString()}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-pink-700">
                    {order.totalQuantity}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-pink-700">
                    {formatDate(order.createdAt)}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(order.status)}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-200"
                    >
                      <EyeIcon className="-ml-1 mr-2 h-4 w-4" />
                      View
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="px-6 py-8 text-center">
                  <div className="text-pink-700">
                    No orders found matching your criteria
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default page;
