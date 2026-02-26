import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/memberDashboard.css";
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

const MemberDashboard = () => {
  const [books, setBooks] = useState([]);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const fetchBooks = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("https://library-management-backend-0un8.onrender.com", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBooks(res.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching books");
    }
  };

  const borrowBook = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `https://library-management-backend-0un8.onrender.com/api/books/${id}/borrow`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Book borrowed successfully!");
      fetchBooks();
    } catch (err) {
      alert(err.response?.data?.message || "Error borrowing book");
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="dashboard-container">
      
      {/* Header with Logout */}
      <div className="dashboard-header">
        <h2>Member Dashboard</h2>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="book-grid">
        {books.map((book) => (
          <div key={book._id} className="book-card">
            <img
              src={bookImages[book.title] || "/default.jpg"}
              alt={book.title}
              className="book-image"
            />
            <h3>{book.title}</h3>
            <p>{book.author}</p>

            <button
              className={book.borrowed ? "borrowed-btn" : "borrow-btn"}
              disabled={book.borrowed}
              onClick={() => borrowBook(book._id)}
            >
              {book.borrowed ? "Borrowed" : "Borrow"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemberDashboard;