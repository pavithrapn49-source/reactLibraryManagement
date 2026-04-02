import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import MemberDashboard from "./pages/MemberDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import LibrarianDashboard from "./pages/LibrarianDashboard";
import MyBorrow from "./pages/MyBorrow";
import PayFine from "./pages/PayFine";
import Books from "./pages/Books";
import { useAuth } from "./context/AuthContext";

/* 🔐 PROTECTED DASHBOARD */
const Dashboard = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  if (user.role === "admin") return <AdminDashboard />;
  if (user.role === "librarian") return <LibrarianDashboard />;

  return <MemberDashboard />; // default
};

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ✅ SINGLE DASHBOARD ROUTE */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* optional direct routes */}
        <Route path="/member" element={<MemberDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/librarian" element={<LibrarianDashboard />} />

        <Route path="/books" element={<Books />} />
        <Route path="/my-borrows" element={<MyBorrow />} />
        <Route path="/pay-fine" element={<PayFine />} />
      </Routes>
    </Router>
  );
}

export default App;