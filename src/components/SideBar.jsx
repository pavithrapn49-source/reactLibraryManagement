import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-56 h-screen bg-gray-100 p-5 shadow-md flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-bold mb-4">
          {user?.role?.toUpperCase() || "GUEST"}
        </h3>

        <nav className="space-y-2">
          {/* Common links */}
          <Link to="/books" className="block hover:text-blue-600">
            Books
          </Link>

          {/* Role-specific links */}
          {user?.role === "admin" && (
            <>
              <Link to="/admin" className="block hover:text-blue-600">
                Dashboard
              </Link>
              <Link to="/users" className="block hover:text-blue-600">
                Manage Users
              </Link>
            </>
          )}

          {user?.role === "librarian" && (
            <>
              <Link to="/librarian" className="block hover:text-blue-600">
                Dashboard
              </Link>
              <Link to="/manage-borrows" className="block hover:text-blue-600">
                Manage Borrows
              </Link>
            </>
          )}

          {user?.role === "member" && (
            <>
              <Link to="/member" className="block hover:text-blue-600">
                Dashboard
              </Link>
              <Link to="/my-borrows" className="block hover:text-blue-600">
                My Borrows
              </Link>
              <Link to="/pay-fine" className="block hover:text-blue-600">
                Pay Fine
              </Link>
            </>
          )}
        </nav>
      </div>

      <button
        onClick={handleLogout}
        className="mt-6 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
