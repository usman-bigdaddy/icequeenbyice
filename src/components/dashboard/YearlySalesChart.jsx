// components/dashboard/YearlySalesChart.jsx
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function YearlySalesChart({ data }) {
  const chartData = {
    labels: data.yearlySales.map((item) => item.year),
    datasets: [
      {
        label: "Total Revenue",
        data: data.yearlySales.map((item) => item.total),
        borderColor: "rgba(236, 72, 153, 1)",
        backgroundColor: "rgba(236, 72, 153, 0.2)",
        tension: 0.4,
        yAxisID: "y",
      },
      {
        label: "Number of Orders",
        data: data.yearlySales.map((item) => item.orders),
        borderColor: "rgba(249, 168, 212, 1)",
        backgroundColor: "rgba(249, 168, 212, 0.2)",
        tension: 0.4,
        yAxisID: "y1",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "left",
        grid: {
          color: "rgba(251, 207, 232, 0.2)",
        },
        title: {
          display: true,
          text: "Revenue ($)",
          color: "rgba(236, 72, 153, 1)",
        },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: "Number of Orders",
          color: "rgba(249, 168, 212, 1)",
        },
      },
      x: {
        grid: {
          color: "rgba(251, 207, 232, 0.2)",
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  return (
    <div className="h-80">
      <Line data={chartData} options={options} />
    </div>
  );
}
