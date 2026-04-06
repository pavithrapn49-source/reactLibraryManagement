import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";

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
import ProtectedRoute from "./components/ProtectedRoute";

/* 🔔 TOAST IMPORT */
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* 🔐 DASHBOARD */
const Dashboard = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  if (user.role === "admin") return <AdminDashboard />;
  if (user.role === "librarian") return <LibrarianDashboard />;

  return <MemberDashboard />;
};

/* 🔥 NEW WRAPPER COMPONENT */
const AppContent = () => {
  const location = useLocation();

  return (
    <>
      {/* 🚫 HIDE NAVBAR ON LOGIN */}
      {location.pathname !== "/login" &&
        location.pathname !== "/" && <Navbar />}

      {/* 🔔 GLOBAL TOAST (ADD HERE) */}
      <ToastContainer position="top-right" autoClose={2000} />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/librarian"
          element={
            <ProtectedRoute role="librarian">
              <LibrarianDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/member"
          element={
            <ProtectedRoute role="member">
              <MemberDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/books"
          element={
            <ProtectedRoute>
              <Books />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-borrows"
          element={
            <ProtectedRoute>
              <MyBorrow />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pay-fine"
          element={
            <ProtectedRoute>
              <PayFine />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

/* 🚀 MAIN APP */
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;