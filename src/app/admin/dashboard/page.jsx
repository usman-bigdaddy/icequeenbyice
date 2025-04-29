"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import MetricCard from "@/components/dashboard/MetricCard";
import OrderStatusPieChart from "@/components/dashboard/OrderStatusPieChart";
import YearlySalesChart from "@/components/dashboard/YearlySalesChart";
import RecentOrdersTable from "@/components/dashboard/RecentOrdersTable";
import MonthlyOrdersChart from "@/components/dashboard/MonthlyOrdersChart";
import {
  ShoppingBagIcon,
  UserGroupIcon, // Using v1 icon name
  CubeIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/outline"; // v1 import path
import DiamondLoader from "@/components/ui/DiamondLoader";

const initialData = {
  totals: {
    users: 0,
    products: 0,
    orders: 0,
    pendingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    revenue: 0,
  },
  recentOrders: [],
  yearlySales: [],
};

const formatNaira = (amount) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(amount);
};

const DashboardPage = () => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: responseData } = await axios.get("/api/dash");
        setData(responseData || initialData);
      } catch (err) {
        console.error("API Error:", err);
        setError(err.message);
        setData(initialData); // Reset to defaults on error
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <DiamondLoader /> // Custom loader component
      // <div className="flex justify-center items-center h-screen">
      //   <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      // </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-pink-100 border-l-4 border-pink-500 text-pink-700 p-4"
        role="alert"
      >
        <p className="font-bold">Error</p>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-pink-800">
        Dashboard Overview
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Customers"
          value={data.totals.users}
          icon={<UserGroupIcon className="h-8 w-8 text-pink-600" />}
          color="bg-pink-100 border-pink-200"
        />
        <MetricCard
          title="Total Products"
          value={data.totals.products}
          icon={<CubeIcon className="h-8 w-8 text-pink-600" />}
          color="bg-pink-100 border-pink-200"
        />
        <MetricCard
          title="Total Orders"
          value={data.totals.orders}
          icon={<ShoppingBagIcon className="h-8 w-8 text-pink-600" />}
          color="bg-pink-100 border-pink-200"
        />
        <MetricCard
          title="Total Revenue"
          value={formatNaira(data.totals.revenue)}
          icon={
            <span className="h-8 w-8 text-pink-600 text-2xl font-bold">₦</span>
          }
          color="bg-pink-100 border-pink-200"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border border-pink-100">
          <h2 className="text-xl font-semibold mb-4 text-pink-700">
            Orders by Status
          </h2>
          <OrderStatusPieChart data={data} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-pink-100">
          <h2 className="text-xl font-semibold mb-4 text-pink-700">
            Monthly Order Count
          </h2>
          {/* <YearlySalesChart data={data} /> */}
          <MonthlyOrdersChart data={data.monthlyOrders} />
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white p-6 rounded-lg shadow border border-pink-100 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-pink-700">
          Recent Orders
        </h2>
        <RecentOrdersTable
          orders={data.recentOrders}
          formatCurrency={formatNaira}
        />
      </div>
    </div>
  );
};

export default DashboardPage;
