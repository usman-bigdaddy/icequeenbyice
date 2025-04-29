// components/dashboard/MetricCard.jsx
export default function MetricCard({ title, value, icon, color }) {
  return (
    <div
      className={`${color} p-6 rounded-lg shadow border transition-all hover:shadow-md hover:translate-y-[-2px]`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-pink-600">{title}</p>
          <p className="text-2xl font-bold mt-2 text-pink-800">{value}</p>
        </div>
        <div className="p-3 rounded-full bg-pink-50">{icon}</div>
      </div>
    </div>
  );
}
