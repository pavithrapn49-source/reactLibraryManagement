import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";

import MemberDashboard from "./pages/MemberDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import LibrarianDashboard from "./pages/LibrarianDashboard";

import MyBorrow from "./pages/MyBorrow";
import PayFine from "./pages/PayFine";
import Books from "./pages/Books";

import Dashboard from "./pages/Dashboard";

import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Unauthorized from "./pages/Unauthorized";

/* 🔔 TOAST */
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* 🔥 WRAPPER */
const AppContent = () => {
  const location = useLocation();
  const { user } = useAuth();

  const hideNavbarPaths = ["/login", "/register", "/"];

  return (
    <>
      {/* ✅ Navbar */}
      {!hideNavbarPaths.includes(location.pathname) && <Navbar />}

      {/* ✅ Toast */}
      <ToastContainer position="top-right" autoClose={2000} />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 🔐 Dashboard Layout (MAIN FIX) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          {/* Default page based on role */}
          <Route
            index
            element={
              user?.role === "admin" ? (
                <AdminDashboard />
              ) : user?.role === "librarian" ? (
                <LibrarianDashboard />
              ) : (
                <MemberDashboard />
              )
            }
          />

          {/* Member pages */}
          <Route path="books" element={<Books />} />
          <Route path="my-borrows" element={<MyBorrow />} />
          <Route path="pay-fine" element={<PayFine />} />
        </Route>

        {/* Unauthorized */}
        <Route path="/unauthorized" element={<Unauthorized />} />
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