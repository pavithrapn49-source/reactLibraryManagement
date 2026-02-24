import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Link, useNavigate } from "react-router-dom";
import "../styles/common.css";
import "../styles/adminDashboard.css";

export default function AdminDashboard({ role: roleFromRoute }) {
  const navigate = useNavigate();
  const role = localStorage.getItem("role") || roleFromRoute || "admin";
  const isAdmin = role === "admin";
  const routePrefix = isAdmin ? "/admin" : "/librarian";

  const stats = [
    { name: "Books", value: 120 },
    { name: "Users", value: 45 },
    { name: "Orders", value: 30 },
  ];

  const borrowData = [
    { month: "Jan", books: 20 },
    { month: "Feb", books: 35 },
    { month: "Mar", books: 50 },
    { month: "Apr", books: 40 },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>{isAdmin ? "Library Admin" : "Library Librarian"}</h2>
        <ul>
          <li><Link to={routePrefix}>Dashboard</Link></li>
          <li><Link to={`${routePrefix}/books`}>Books</Link></li>
          <li><Link to={`${routePrefix}/profile`}>Profile</Link></li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="header">
          <h1>{isAdmin ? "Admin Dashboard" : "Librarian Dashboard"}</h1>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
<div className="stats">
  <div className="card">
    📚 <strong>Total Books</strong>
    <p>120</p>
  </div>

  <div className="card">
    👥 <strong>Users</strong>
    <p>45</p>
  </div>

  <div className="card">
    🛒 <strong>Orders</strong>
    <p>30</p>
  </div>
</div>


        {/* Charts */}
        <div className="charts">
          <div className="chart-box">
            <h3>Library Overview</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stats}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-box">
            <h3>Monthly Borrow Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={borrowData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line dataKey="books" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
}
