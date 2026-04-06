import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // 🔐 Role-based dashboard
  const getDashboardPath = () => {
    if (user?.role === "admin") return "/admin";
    if (user?.role === "librarian") return "/librarian";
    return "/member";
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="logo">📚 Library</div>

      <div className="nav-links">
        {/* 🎯 Role-based dashboard */}
        <NavLink to={getDashboardPath()}>Dashboard</NavLink>

        <NavLink to="/books">Books</NavLink>

        {/* 👤 Only member features */}
        {user?.role === "member" && (
          <>
            <NavLink to="/my-borrows">My Books</NavLink>
            <NavLink to="/pay-fine">Pay Fine</NavLink>
          </>
        )}

        {/* 👑 Admin only */}
        {user?.role === "admin" && (
          <NavLink to="/admin">Admin Panel</NavLink>
        )}
      </div>

      {/* 🔴 Logout */}
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
};

export default Navbar;