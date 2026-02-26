import { Link, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div style={{ width: "200px", padding: "20px", background: "#ddd", height: "100vh" }}>
      <h3>{user?.role?.toUpperCase()}</h3>

      {user?.role === "admin" && (
        <>
          <Link to="/admin">Dashboard</Link><br />
          <Link to="/books">Books</Link><br />
        </>
      )}

      {user?.role === "librarian" && (
        <>
          <Link to="/librarian">Dashboard</Link><br />
          <Link to="/books">Books</Link><br />
        </>
      )}

      {user?.role === "member" && (
        <>
          <Link to="/member">Dashboard</Link><br />
          <Link to="/books">Books</Link><br />
          <Link to="/myborrow">My Borrow</Link><br />
        </>
      )}

      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Sidebar;