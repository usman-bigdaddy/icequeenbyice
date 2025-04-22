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
  ArrowUpIcon,
  ArrowDownIcon,
  ShoppingCartIcon,
  ShoppingBagIcon,
} from "@heroicons/react/outline";
import DiamondLoader from "@/components/ui/DiamondLoader";
import PageHeader from "@/components/ui/PageHeader";
import { useSelector } from "react-redux";

const statusOptions = [
  { value: "ALL", label: "All Orders" },
  { value: "PENDING", label: "Pending" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
];

const ITEMS_PER_PAGE = 5;

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "desc",
  });
  const [dateFilter, setDateFilter] = useState({ from: "", to: "" });
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        let url = `/api/orders?userId=${user?.id}`;
        if (selectedStatus !== "ALL") {
          url += `&status=${selectedStatus}`;
        }

        const response = await axios.get(url);
        if (response.data.success) {
          setOrders(response.data.data);
          setFilteredOrders(response.data.data);
        }
      } catch (err) {
        setError(err.message || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [selectedStatus]);

  useEffect(() => {
    // Apply all filters
    let result = [...orders];

    // Date filter
    if (dateFilter.from || dateFilter.to) {
      const fromDate = dateFilter.from ? new Date(dateFilter.from) : null;
      const toDate = dateFilter.to ? new Date(dateFilter.to) : null;

      result = result.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return (
          (!fromDate || orderDate >= fromDate) &&
          (!toDate || orderDate <= new Date(toDate.getTime() + 86400000)) // Include end date
        );
      });
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (order) =>
          order.shippingDetails.receiverName.toLowerCase().includes(query) ||
          order.id.toLowerCase().includes(query) ||
          order.shippingDetails.fullAddress.toLowerCase().includes(query)
      );
    }

    // Sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredOrders(result);
    setCurrentPage(1); // Reset pagination on filter change
  }, [orders, dateFilter, sortConfig, searchQuery]);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

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

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? (
      <ArrowUpIcon className="h-3 w-3 ml-1 inline" />
    ) : (
      <ArrowDownIcon className="h-3 w-3 ml-1 inline" />
    );
  };

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const currentItems = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <PageHeader
        title="My Orders"
        subtitle="Your curated selection of elegance"
      />

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Link
          href="/customer/cart"
          className="flex items-center px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg shadow-pink hover:from-pink-600 hover:to-rose-600 transition-all"
        >
          <ShoppingCartIcon className="h-5 w-5 mr-2" />
          View Cart
        </Link>
        <Link
          href="/customer/product"
          className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg shadow-purple hover:from-purple-600 hover:to-indigo-600 transition-all"
        >
          <ShoppingBagIcon className="h-5 w-5 mr-2" />
          Continue Shopping
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-4 mb-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-pink-800 mb-1">
              Search
            </label>
            <input
              type="text"
              placeholder="Search orders..."
              className="w-full px-4 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-pink-800 mb-1">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-pink-800 mb-1">
              From Date
            </label>
            <input
              type="date"
              value={dateFilter.from}
              onChange={(e) =>
                setDateFilter({ ...dateFilter, from: e.target.value })
              }
              className="w-full px-4 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-pink-800 mb-1">
              To Date
            </label>
            <input
              type="date"
              value={dateFilter.to}
              onChange={(e) =>
                setDateFilter({ ...dateFilter, to: e.target.value })
              }
              className="w-full px-4 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-pink-100 overflow-hidden mb-6">
        <Table className="min-w-full divide-y divide-pink-100">
          <TableHeader className="bg-pink-50">
            <TableRow>
              <TableHead
                className="px-6 py-3 text-left text-xs font-medium text-pink-900 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort("id")}
              >
                Order ID {getSortIcon("id")}
              </TableHead>
              <TableHead
                className="px-6 py-3 text-left text-xs font-medium text-pink-900 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort("shippingDetails.receiverName")}
              >
                Receiver {getSortIcon("shippingDetails.receiverName")}
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-pink-900 uppercase tracking-wider">
                Delivery Address
              </TableHead>
              <TableHead
                className="px-6 py-3 text-left text-xs font-medium text-pink-900 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort("totalAmount")}
              >
                Total ₦ {getSortIcon("totalAmount")}
              </TableHead>
              <TableHead
                className="px-6 py-3 text-left text-xs font-medium text-pink-900 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort("createdAt")}
              >
                Date {getSortIcon("createdAt")}
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
            {currentItems.length > 0 ? (
              currentItems.map((order) => (
                <TableRow
                  key={order.id}
                  className="hover:bg-pink-50 transition-colors"
                >
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-pink-900">
                    #{order.id.slice(0, 8)}
                  </TableCell>
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
                    {formatDate(order.createdAt)}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(order.status)}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/customer/myorders/${order.id}`}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
                    >
                      <EyeIcon className="-ml-1 mr-2 h-4 w-4" />
                      View
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="px-6 py-8 text-center">
                  <div className="text-pink-700 flex flex-col items-center">
                    <ShoppingBagIcon className="h-12 w-12 text-pink-300 mb-2" />
                    No orders found matching your criteria
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {filteredOrders.length > ITEMS_PER_PAGE && (
        <div className="flex items-center justify-between border-t border-pink-100 px-4 py-3">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-pink-300 text-sm font-medium rounded-md text-pink-700 bg-white hover:bg-pink-50"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-pink-300 text-sm font-medium rounded-md text-pink-700 bg-white hover:bg-pink-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-pink-700">
                Showing{" "}
                <span className="font-medium">
                  {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(
                    currentPage * ITEMS_PER_PAGE,
                    filteredOrders.length
                  )}
                </span>{" "}
                of <span className="font-medium">{filteredOrders.length}</span>{" "}
                orders
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-pink-300 bg-white text-sm font-medium text-pink-500 hover:bg-pink-50"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronRightIcon
                    className="h-5 w-5 rotate-180"
                    aria-hidden="true"
                  />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === page
                          ? "bg-pink-500 border-pink-500 text-white"
                          : "bg-white border-pink-300 text-pink-700 hover:bg-pink-50"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-pink-300 bg-white text-sm font-medium text-pink-500 hover:bg-pink-50"
                >
                  <span className="sr-only">Next</span>
                  <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
