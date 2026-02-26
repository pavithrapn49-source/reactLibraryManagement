import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/memberDashboard.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const API = "https://library-management-backend-0un8.onrender.com/api/books";

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

  // ✅ Fetch Books
  const fetchBooks = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API}/api/books`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBooks(res.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching books");
    }
  };

  // ✅ Borrow Book
  const borrowBook = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${API}/api/books/${id}/borrow`,
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

  // ✅ Return Book
  

const returnBook = async (id) => {
  try {
    const token = localStorage.getItem("token");

    await axios.put(
      `${API}/api/books/${id}/return`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    alert("Book returned successfully!");
    fetchBooks();

  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Error returning book");
  }
};

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <h2>Member Dashboard</h2>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Book Grid */}
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

            {/* 🔥 Borrow / Return Logic */}
            {book.borrowed ? (
              <>
                <button className="borrowed-btn" disabled>
                  Borrowed
                </button>

                <button
                  className="return-btn"
                  onClick={() => returnBook(book._id)}
                >
                  Return
                </button>

                <p className="due-text">
                  Due:{" "}
                  {book.dueDate
                    ? new Date(book.dueDate).toLocaleDateString()
                    : "N/A"}
                </p>
              </>
            ) : (
              <button
                className="borrow-btn"
                onClick={() => borrowBook(book._id)}
              >
                Borrow
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemberDashboard;