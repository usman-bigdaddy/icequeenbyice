export default function DataTable() {
  const data = [
    {
      id: 1,
      name: "John Doe",
      order: "#1234",
      date: "2024-01-01",
      amount: "$120",
      status: "Completed",
    },
    {
      id: 2,
      name: "Jane Smith",
      order: "#1235",
      date: "2024-01-02",
      amount: "$150",
      status: "Pending",
    },
    {
      id: 3,
      name: "Mike Johnson",
      order: "#1236",
      date: "2024-01-03",
      amount: "$300",
      status: "Completed",
    },
    {
      id: 4,
      name: "Sarah Brown",
      order: "#1237",
      date: "2024-01-04",
      amount: "$200",
      status: "Cancelled",
    },
  ];

  return (
    <div className="bg-black p-6 rounded-lg shadow-md">
      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-600">
            <th className="p-3 border border-gray-300">ID</th>
            <th className="p-3 border border-gray-300">Name</th>
            <th className="p-3 border border-gray-300">Order</th>
            <th className="p-3 border border-gray-300">Date</th>
            <th className="p-3 border border-gray-300">Amount</th>
            <th className="p-3 border border-gray-300">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="text-center border border-gray-200">
              <td className="p-3">{row.id}</td>
              <td className="p-3">{row.name}</td>
              <td className="p-3">{row.order}</td>
              <td className="p-3">{row.date}</td>
              <td className="p-3">{row.amount}</td>
              <td
                className={`p-3 ${
                  row.status === "Completed" ? "text-green-500" : "text-red-500"
                }`}
              >
                {row.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
