import {
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Navbar from "./components/Navbar";

import ManageUsers from "./pages/ManageUsers";

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

/* TOAST */

import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

/* ================= APP CONTENT ================= */

const AppContent = () => {

  const location =
    useLocation();

  const { user } =
    useAuth();

  const hideNavbarPaths = [
    "/login",
    "/register",
    "/",
  ];

  return (
    <>

      {/* NAVBAR */}

      {!hideNavbarPaths.includes(
        location.pathname
      ) && <Navbar />}

      {/* TOAST */}

      <ToastContainer
        position="top-right"
        autoClose={2000}
      />

      {/* ROUTES */}

      <Routes>

        {/* ================= PUBLIC ================= */}

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* ================= DASHBOARD ================= */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>

              <Dashboard />

            </ProtectedRoute>
          }
        >

          {/* DEFAULT DASHBOARD */}

          <Route
            index
            element={
              user?.role ===
              "admin" ? (

                <AdminDashboard />

              ) : user?.role ===
                "librarian" ? (

                <LibrarianDashboard />

              ) : (

                <MemberDashboard />

              )
            }
          />

          {/* ================= BOOKS ================= */}

          <Route
            path="books"
            element={<Books />}
          />

          {/* ================= BORROWS ================= */}

          <Route
            path="my-borrows"
            element={<MyBorrow />}
          />

          {/* ================= PAY FINE ================= */}

          <Route
            path="pay-fine"
            element={<PayFine />}
          />

          {/* ================= MANAGE USERS ================= */}

          <Route
            path="users"
            element={<ManageUsers />}
          />

        </Route>

        {/* ================= UNAUTHORIZED ================= */}

        <Route
          path="/unauthorized"
          element={
            <Unauthorized />
          }
        />

      </Routes>
    </>
  );
};

/* ================= MAIN APP ================= */

function App() {

  return <AppContent />;
}

export default App;