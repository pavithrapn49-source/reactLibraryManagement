import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/adminDashboard.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const bookImages = {
  "React Guide": "/react guide.jpg",
  "Geographical Tales": "/geo tales.jpg",
  "Harry Potter": "/harry potter.jpg",
  "Java Guide": "/java.jpg",
  "Children's Tales": "/childrens tales.jpg",
  "Lessons of Maths": "/maths.jpg",
  "Little Ones": "/little ones.jpg",
};

const AdminDashboard = () => {
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);

  const { logout } = useAuth();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    logout();              // clears token from context
    localStorage.removeItem("token"); // extra safety
    navigate("/login");    // redirect to login
  };

  const fetchBooks = async () => {
    const res = await axios.get("https://library-management-backend-0un8.onrender.com/api/books", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setBooks(res.data);
  };

 const fetchUsers = async () => {
  try {
    const res = await axios.get(
      "https://library-management-backend-0un8.onrender.com/api/auth/users",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log("Users:", res.data); // 👈 Add this
    setUsers(res.data);
  } catch (error) {
    console.error("Error fetching users:", error.response?.data || error.message);
  }
};

  const deleteBook = async (id) => {
    await axios.delete(`https://library-management-backend-0un8.onrender.com/api/books/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchBooks();
  };

  const deleteUser = async (id) => {
    await axios.delete(`https://library-management-backend-0un8.onrender.com/api/auth/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchUsers();
  };

  useEffect(() => {
    fetchBooks();
    fetchUsers();
  }, []);

  return (
    <div className="dashboard-container">
      
      {/* ✅ Logout Button */}
      <div style={{ textAlign: "right" }}>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <h2>👑 Admin Dashboard</h2>

      <h3>All Books</h3>
      <div className="book-grid">
        {books.map((b) => (
          <div key={b._id} className="book-card">
            <img
              src={bookImages[b.title] || "/default.jpg"}
              alt={b.title}
              onError={(e) => (e.target.src = "/default.jpg")}
            />
            <h4>{b.title}</h4>
            <p>{b.author}</p>
            <p>{b.borrowed ? "Borrowed" : "Available"}</p>
            <button onClick={() => deleteBook(b._id)}>Delete</button>
          </div>
        ))}
      </div>

      <h3 style={{ marginTop: "40px" }}>All Users</h3>
      <div className="user-grid">
        {users.map((u) => (
          <div key={u._id} className="user-card">
            <h4>{u.name}</h4>
            <p>{u.email}</p>
            <p>Role: {u.role}</p>
            <button onClick={() => deleteUser(u._id)}>Delete User</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;