import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {useTheme,} from "../context/ThemeContext";
import "../styles/Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const {darkMode,toggleTheme,} = useTheme();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const userName = user?.name || "User";
  const userRole = user?.role || "member";

  return (
    <nav className="navbar">
      {/* LOGO */}
      <div
        className="logo"
        onClick={() => navigate("/dashboard")}
      >
        📚 Smart Library
      </div>

      {/* LINKS */}
      <div className="nav-links">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? "nav-link active-link" : "nav-link"
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/dashboard/books"
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
              to="/dashboard/my-borrows"
              className={({ isActive }) =>
                isActive ? "nav-link active-link" : "nav-link"
              }
            >
              My Books
            </NavLink>

            <NavLink
              to="/dashboard/pay-fine"
              className={({ isActive }) =>
                isActive ? "nav-link active-link" : "nav-link"
              }
            >
              Fine Payment
            </NavLink>
          </>
        )}

        {/* ADMIN */}
        {userRole === "admin" && (
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "nav-link active-link" : "nav-link"
            }
          >
            Admin Panel
          </NavLink>
        )}

        {/* LIBRARIAN */}
        {userRole === "librarian" && (
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "nav-link active-link" : "nav-link"
            }
          >
            Librarian Panel
          </NavLink>
        )}
      </div>

      {/* RIGHT SIDE */}
      <div className="nav-right">
        <span className="user-role">
          👤 {userName} ({userRole})
        </span>
<button
  className="theme-btn"
  onClick={toggleTheme}
>
  {darkMode ? "☀ Light" : "🌙 Dark"}
</button>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;