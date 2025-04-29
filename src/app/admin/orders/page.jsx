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
import {
  EyeIcon,
  RefreshIcon,
  SearchIcon,
  FilterIcon,
  CalendarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/outline";
import DiamondLoader from "@/components/ui/DiamondLoader";
import { Button } from "@/components/ui/button";

const statusOptions = [
  { value: "ALL", label: "All Orders", color: "bg-gray-100 text-gray-800" },
  { value: "PENDING", label: "Pending", color: "bg-pink-100 text-pink-800" },
  { value: "SHIPPED", label: "Shipped", color: "bg-blue-100 text-blue-800" },
  {
    value: "DELIVERED",
    label: "Delivered",
    color: "bg-emerald-100 text-emerald-800",
  },
  {
    value: "CANCELLED",
    label: "Cancelled",
    color: "bg-rose-100 text-rose-800",
  },
];

const Page = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "desc",
  });

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      let url = "/api/orders";
      const params = new URLSearchParams();

      if (selectedStatus !== "ALL") params.append("status", selectedStatus);

      if (params.toString()) url += `?${params.toString()}`;

      const response = await axios.get(url);
      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchOrders();
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedOrders = [...orders].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const filteredOrders = sortedOrders.filter((order) => {
    const matchesSearch =
      order.customerDetails.fullName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      order.customerDetails.email
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      order.shippingDetails.fullAddress
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (order.note &&
        order.note.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesSearch;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const option =
      statusOptions.find((opt) => opt.value === status) || statusOptions[0];
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${option.color}`}
      >
        {option.label}
      </span>
    );
  };

  const SortIndicator = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return null;
    return (
      <span className="ml-1">
        {sortConfig.direction === "asc" ? (
          <ChevronUpIcon className="h-3 w-3 inline" />
        ) : (
          <ChevronDownIcon className="h-3 w-3 inline" />
        )}
      </span>
    );
  };

  if (loading && !isRefreshing) {
    return <DiamondLoader />;
  }

  if (error) {
    return (
      <div className="px-5 py-5 text-rose-500 bg-rose-50 rounded-lg mx-4">
        Error: {error}
        <Button
          variant="outline"
          className="ml-4 border-pink-200 hover:bg-pink-50"
          onClick={fetchOrders}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-6 mb-8 shadow-sm border border-pink-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-pink-900">
              Order Management
            </h2>
            <p className="text-pink-700 mt-1">
              {filteredOrders.length} orders found
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="border-pink-200 hover:bg-pink-50"
            >
              <RefreshIcon
                className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>

        <div className="mt-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-pink-400" />
            <input
              type="text"
              placeholder="Search orders..."
              className="w-full pl-10 pr-4 py-2 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 text-pink-900"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border border-pink-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 text-pink-900 bg-white"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-pink-100 overflow-hidden">
        <Table className="min-w-full divide-y divide-pink-100">
          <TableHeader className="bg-pink-50">
            <TableRow>
              <TableHead
                className="px-6 py-3 text-left text-xs font-medium text-pink-900 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("customerDetails.fullName")}
              >
                <div className="flex items-center">
                  Customer
                  <SortIndicator columnKey="customerDetails.fullName" />
                </div>
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-pink-900 uppercase tracking-wider">
                Shipping
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-pink-900 uppercase tracking-wider">
                Items
              </TableHead>
              <TableHead
                className="px-6 py-3 text-left text-xs font-medium text-pink-900 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("totalAmount")}
              >
                <div className="flex items-center">
                  Amount
                  <SortIndicator columnKey="totalAmount" />
                </div>
              </TableHead>
              <TableHead
                className="px-6 py-3 text-left text-xs font-medium text-pink-900 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("createdAt")}
              >
                <div className="flex items-center">
                  Date
                  <SortIndicator columnKey="createdAt" />
                </div>
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-pink-900 uppercase tracking-wider">
                Status
              </TableHead>
              <TableHead className="px-6 py-3 text-right text-xs font-medium text-pink-900 uppercase tracking-wider">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white divide-y divide-pink-100">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <TableRow
                  key={order.id}
                  className="hover:bg-pink-50 transition-colors"
                >
                  <TableCell className="px-6 py-4">
                    <div className="font-medium text-pink-900">
                      {order.customerDetails.fullName}
                    </div>
                    <div className="text-xs text-pink-500 mt-1 truncate max-w-[180px]">
                      {order.customerDetails.email}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-pink-700">
                    Receiver: {order.shippingDetails.receiverName}
                    <div className="text-xs text-pink-500 mt-1">
                      Address: {order.shippingDetails.fullAddress}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="font-medium text-pink-900">
                      {order.totalQuantity} item
                      {order.totalQuantity !== 1 ? "s" : ""}
                    </div>
                    {order.note && (
                      <div className="text-xs text-pink-500 mt-1 truncate max-w-[120px]">
                        {order.note}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="px-6 py-4 font-medium text-pink-900">
                    ₦{order.totalAmount.toLocaleString()}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-pink-700">
                    {formatDate(order.createdAt)}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {getStatusBadge(order.status)}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-200"
                    >
                      <EyeIcon className="-ml-1 mr-1 h-4 w-4" />
                      Details
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-pink-700 mb-4">
                      No orders found matching your criteria
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedStatus("ALL");
                      }}
                      className="border-pink-200 hover:bg-pink-50"
                    >
                      Clear filters
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {filteredOrders.length > 0 && (
        <div className="mt-4 flex justify-between items-center text-sm text-pink-700">
          <div>
            Showing {filteredOrders.length} of {orders.length} orders
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              className="border-pink-200 hover:bg-pink-50"
              disabled
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-pink-200 hover:bg-pink-50"
              disabled
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
