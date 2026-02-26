import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/memberDashboard.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const API = "https://library-management-backend-0un8.onrender.com";

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
  const [myBorrows, setMyBorrows] = useState([]);

  const { logout } = useAuth();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // ================= FETCH BOOKS =================
  const fetchBooks = async () => {
    try {
      const res = await axios.get(`${API}/api/books`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooks(res.data);
    } catch (err) {
      alert("Error fetching books");
    }
  };

  // ================= FETCH MY BORROWS =================
  const fetchMyBorrows = async () => {
    try {
      const res = await axios.get(`${API}/api/borrow/my-borrows`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyBorrows(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= BORROW BOOK =================
 
const borrowBook = async (bookId) => {
  try {
    await axios.post(
      `${API}/api/borrow/${bookId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("Book borrowed successfully!");
    fetchBooks();
    fetchMyBorrows();
  } catch (err) {
    alert(err.response?.data?.message || "Error borrowing book");
  }
};
  // ================= RETURN BOOK =================

const returnBook = async (borrowId) => {
  try {
    await axios.put(
      `${API}/api/borrow/return/${borrowId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("Book returned successfully!");
    fetchBooks();
    fetchMyBorrows();
  } catch (err) {
    alert(err.response?.data?.message || "Error returning book");
  }
};

  // ================= LOGOUT =================
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    fetchBooks();
    fetchMyBorrows();
  }, []);

  return (
    <div className="dashboard-container">
      {/* HEADER */}
      <div className="dashboard-header">
        <h2>Member Dashboard</h2>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* ================= AVAILABLE BOOKS ================= */}
      <h3>Available Books</h3>
      <div className="book-grid">
        {books.map((book) => (
          <div key={book._id} className="book-card">
            <img
              src={bookImages[book.title] || "/default.jpg"}
              alt={book.title}
              className="book-image"
            />
            <h4>{book.title}</h4>
            <p>{book.author}</p>
            <p>Status: {book.borrowed ? "Borrowed" : "Available"}</p>

            {!book.borrowed && (
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

      {/* ================= MY BORROWED BOOKS ================= */}
      <h3 style={{ marginTop: "40px" }}>My Borrowed Books</h3>
      <div className="book-grid">
        {myBorrows.length === 0 && <p>No borrowed books</p>}

        {myBorrows.map((borrow) => {
          const dueDate = borrow.dueDate
            ? new Date(borrow.dueDate).toLocaleDateString()
            : "N/A";

          return (
            <div key={borrow._id} className="book-card">
              <h4>{borrow.book?.title}</h4>
              <p>{borrow.book?.author}</p>
              <p>
                Due Date: <strong>{dueDate}</strong>
              </p>

              <button
                className="return-btn"
                onClick={() => returnBook(borrow._id)}  
              >
                Return
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MemberDashboard;