import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import Books from "./pages/Books";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard role="admin" />
          </ProtectedRoute>
        }
      />

      <Route
        path="/librarian"
        element={
          <ProtectedRoute allowedRoles={["librarian"]}>
            <AdminDashboard role="librarian" />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/books"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Books />
          </ProtectedRoute>
        }
      />

      <Route
        path="/librarian/books"
        element={
          <ProtectedRoute allowedRoles={["librarian"]}>
            <Books />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/profile"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/librarian/profile"
        element={
          <ProtectedRoute allowedRoles={["librarian"]}>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<h2>Page Not Found</h2>} />
    </Routes>
  );
}

export default App;
