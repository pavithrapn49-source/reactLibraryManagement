import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) =>
    location.pathname === path;

  return (
    <aside className="w-64 h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white p-5 shadow-2xl flex flex-col justify-between sticky top-0">
      
      {/* TOP SECTION */}
      <div>
        {/* LOGO */}
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-extrabold text-blue-400">
            📚 Smart Library
          </h2>

          <p className="text-sm text-gray-300 mt-2">
            {user?.role?.toUpperCase() || "GUEST"}
          </p>
        </div>

        {/* NAVIGATION */}
        <nav className="space-y-3">

          {/* MEMBER */}
          {user?.role === "member" && (
            <>
              <Link
                to="/dashboard"
                className={`block px-4 py-3 rounded-xl transition-all duration-300 font-medium
                ${
                  isActive("/dashboard")
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg"
                    : "bg-white/10 hover:bg-blue-500/30"
                }`}
              >
                🏠 Dashboard
              </Link>

              <Link
                to="/dashboard/books"
                className={`block px-4 py-3 rounded-xl transition-all duration-300 font-medium
                ${
                  isActive("/dashboard/books")
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg"
                    : "bg-white/10 hover:bg-blue-500/30"
                }`}
              >
                📖 Books
              </Link>

              <Link
                to="/dashboard/my-borrows"
                className={`block px-4 py-3 rounded-xl transition-all duration-300 font-medium
                ${
                  isActive("/dashboard/my-borrows")
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg"
                    : "bg-white/10 hover:bg-blue-500/30"
                }`}
              >
                📚 My Borrows
              </Link>

              <Link
                to="/dashboard/pay-fine"
                className={`block px-4 py-3 rounded-xl transition-all duration-300 font-medium
                ${
                  isActive("/dashboard/pay-fine")
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg"
                    : "bg-white/10 hover:bg-blue-500/30"
                }`}
              >
                💳 Fine Payment
              </Link>
            </>
          )}

          {/* ADMIN */}
          {user?.role === "admin" && (
            <>
              <Link
                to="/admin"
                className="block px-4 py-3 rounded-xl bg-white/10 hover:bg-blue-500/30 transition"
              >
                🛠 Dashboard
              </Link>

              <Link
                to="/users"
                className="block px-4 py-3 rounded-xl bg-white/10 hover:bg-blue-500/30 transition"
              >
                👥 Manage Users
              </Link>
            </>
          )}

          {/* LIBRARIAN */}
          {user?.role === "librarian" && (
            <>
              <Link
                to="/librarian"
                className="block px-4 py-3 rounded-xl bg-white/10 hover:bg-blue-500/30 transition"
              >
                📊 Dashboard
              </Link>

              <Link
                to="/manage-borrows"
                className="block px-4 py-3 rounded-xl bg-white/10 hover:bg-blue-500/30 transition"
              >
                📚 Manage Borrows
              </Link>
            </>
          )}
        </nav>
      </div>

      {/* LOGOUT */}
      <button
        onClick={handleLogout}
        className="w-full py-3 rounded-xl bg-red-500 hover:bg-red-600 transition-all duration-300 font-semibold shadow-lg"
      >
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;