// components/dashboard/OrderStatusChart.jsx
"use client";

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register only the necessary ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

export default function OrderStatusChart({ data }) {
  const chartData = {
    labels: ["Pending", "Shipped", "Delivered"],
    datasets: [
      {
        data: [
          data?.totals?.pendingOrders || 0,
          data?.totals?.shippedOrders || 0,
          data?.totals?.deliveredOrders || 0,
        ],
        backgroundColor: [
          "rgba(249, 168, 212, 0.7)", // Light pink
          "rgba(236, 72, 153, 0.7)", // Medium pink
          "rgba(190, 24, 93, 0.7)", // Dark pink
        ],
        borderColor: [
          "rgba(249, 168, 212, 1)",
          "rgba(236, 72, 153, 1)",
          "rgba(190, 24, 93, 1)",
        ],
        borderWidth: 1,
        cutout: "70%", // Makes it a donut instead of pie
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const value = context.raw || 0;
            const percentage = Math.round((value / total) * 100);
            return `${context.label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="h-80">
      <Doughnut data={chartData} options={options} />
    </div>
  );
}
