// components/dashboard/MonthlyOrdersChart.jsx
"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function MonthlyOrdersChart({ data }) {
  // Prepare chart data
  const chartData = {
    labels: data?.map((item) => item.month) || [],
    datasets: [
      {
        label: "Orders per Month",
        data: data?.map((item) => item.count) || [],
        backgroundColor: "rgba(236, 72, 153, 0.7)", // Pink color
        borderColor: "rgba(190, 24, 93, 1)", // Darker pink border
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Monthly Orders (Excluding Cancelled)",
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Number of Orders",
        },
      },
      x: {
        title: {
          display: true,
          text: "Month",
        },
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow border border-pink-100 h-[400px]">
      <Bar data={chartData} options={options} />
    </div>
  );
}
