import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{ padding: "15px", background: "#eee" }}>
    <button onClick={logout}>Logout</button>

      <h1>Library System</h1>
      <Link to="/login">Login</Link> |{" "}
      <Link to="/register">Register</Link> |{" "}
      <Link to="/admin">Admin</Link>
        </nav>
  );
}

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div style={{ padding: 10, background: "#eee" }}>
      <button onClick={() => navigate("/admin")}>Dashboard</button>
      <button onClick={() => navigate("/books")}>Books</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
