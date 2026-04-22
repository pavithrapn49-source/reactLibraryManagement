import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  /* ================= ROLE DASHBOARD ================= */
  const getDashboardRoute = () => {
    if (user?.role === "admin") return "/admin";
    if (user?.role === "librarian") return "/librarian";
    return "/dashboard";
  };

  const userName = user?.name || "User";
  const userRole = user?.role || "member";

  return (
    <nav className="navbar">
      {/* ================= LOGO ================= */}
      <div
        className="logo"
        onClick={() => navigate(getDashboardRoute())}
      >
        📚 Smart Library
      </div>

      {/* ================= LINKS ================= */}
      <div className="nav-links">
        <NavLink
          to={getDashboardRoute()}
          className={({ isActive }) =>
            isActive ? "nav-link active-link" : "nav-link"
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/books"
          className={({ isActive }) =>
            isActive ? "nav-link active-link" : "nav-link"
          }
        >
          Books
        </NavLink>

        {/* MEMBER LINKS */}
        {userRole === "member" && (
          <>
            <NavLink
              to="/my-borrows"
              className={({ isActive }) =>
                isActive ? "nav-link active-link" : "nav-link"
              }
            >
              My Books
            </NavLink>

            <NavLink
              to="/pay-fine"
              className={({ isActive }) =>
                isActive ? "nav-link active-link" : "nav-link"
              }
            >
              Pay Fine
            </NavLink>
          </>
        )}

        {/* ADMIN LINK */}
        {userRole === "admin" && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              isActive ? "nav-link active-link" : "nav-link"
            }
          >
            Admin Panel
          </NavLink>
        )}

        {/* LIBRARIAN LINK */}
        {userRole === "librarian" && (
          <NavLink
            to="/librarian"
            className={({ isActive }) =>
              isActive ? "nav-link active-link" : "nav-link"
            }
          >
            Librarian Panel
          </NavLink>
        )}
      </div>

      {/* ================= RIGHT SIDE ================= */}
      <div className="nav-right">
        <span className="user-role">
          👤 {userName} ({userRole})
        </span>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;