"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import StatCard from "@/components/StatCard";

const Page = () => {
  const [dashboardData, setDashboardData] = useState({
    totalCustomers: 0,
    totalStock: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = "";
        const res = await axios.get("/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDashboardData(res.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to fetch dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 p-6 bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-6 bg-gray-100 flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-black">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={dashboardData.totalCustomers}
          icon="👥"
        />
        <StatCard
          title="Total Products"
          value={dashboardData.totalStock}
          icon="📦"
        />
        {/* Uncomment and update these if you have the data */}
        {/* <StatCard
          title="Total Sales"
          value={new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
          }).format(dashboardData.totalSales || 0)}
          icon="💰"
        />
        <StatCard
          title="Ongoing Campaigns"
          value={dashboardData.pendingCampaigns || 0}
          icon="📦"
        />
        <StatCard
          title="Completed Campaigns"
          value={dashboardData.completedCampaigns || 0}
          icon="📈"
        /> */}
      </div>
      <div className="mt-8"></div>
    </div>
  );
};

export default Page;
