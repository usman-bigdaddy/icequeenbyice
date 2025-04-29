// components/dashboard/OrderStatusChart.jsx
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function OrderStatusChart({ data }) {
  const chartData = {
    labels: ["Pending", "Shipped", "Delivered"],
    datasets: [
      {
        label: "Orders by Status",
        data: [
          data.totals.pendingOrders,
          data.totals.shippedOrders,
          data.totals.deliveredOrders,
        ],
        backgroundColor: [
          "rgba(249, 168, 212, 0.7)",
          "rgba(236, 72, 153, 0.7)",
          "rgba(190, 24, 93, 0.7)",
        ],
        borderColor: [
          "rgba(249, 168, 212, 1)",
          "rgba(236, 72, 153, 1)",
          "rgba(190, 24, 93, 1)",
        ],
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
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(251, 207, 232, 0.2)",
        },
      },
      x: {
        grid: {
          color: "rgba(251, 207, 232, 0.2)",
        },
      },
    },
  };

  return (
    <div className="h-80">
      <Bar data={chartData} options={options} />
    </div>
  );
}
