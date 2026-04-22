import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = ["#22c55e", "#ef4444", "#3b82f6"];

const DashboardCharts = ({ books }) => {
  // ---------------- STATS ----------------
  const totalBooks = books.length;

  const availableBooks = books.filter((b) => b.available).length;

  const borrowedBooks = books.filter((b) => !b.available).length;

  const reservedBooks = books.filter((b) => b.reserved).length || 0;

  // ---------------- PIE DATA ----------------
  const pieData = [
    { name: "Available", value: availableBooks },
    { name: "Borrowed", value: borrowedBooks },
    { name: "Reserved", value: reservedBooks },
  ];

  // ---------------- BAR DATA ----------------
  const barData = [
    {
      name: "Books",
      Available: availableBooks,
      Borrowed: borrowedBooks,
      Reserved: reservedBooks,
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 mt-6">

      {/* ================= PIE CHART ================= */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-3">
          📊 Book Status Overview
        </h3>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* ================= BAR CHART ================= */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-3">
          📈 Book Comparison
        </h3>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Available" fill="#22c55e" />
            <Bar dataKey="Borrowed" fill="#ef4444" />
            <Bar dataKey="Reserved" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardCharts;