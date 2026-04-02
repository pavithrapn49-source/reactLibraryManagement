import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "10px 20px",
        background: "#333",
        color: "white",
      }}
    >
      <h2>📚 Library</h2>

      <div style={{ display: "flex", gap: "15px" }}>
        <Link
          to={
            user?.role === "admin"
              ? "/admin"
              : user?.role === "librarian"
              ? "/librarian"
              : "/member"
          }
          style={{ color: "white" }}
        >
          Dashboard
        </Link>

        <Link to="/books" style={{ color: "white" }}>
          Books
        </Link>

        <Link to="/my-borrows" style={{ color: "white" }}>
          My Books
        </Link>

        <Link to="/pay-fine" style={{ color: "white" }}>
          Pay Fine
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;