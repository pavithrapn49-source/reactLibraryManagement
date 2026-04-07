import { useState, useEffect } from "react";
import axios from "../api/axios";
import "../styles/memberDashboard.css"; 
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

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
  const [history, setHistory] = useState([]);

  const { logout } = useAuth();
  const navigate = useNavigate();

  // ================= FETCH =================
  const fetchBooks = async () => {
    const res = await axios.get("/books");
    setBooks(res.data);
  };

  const fetchMyBorrows = async () => {
    const res = await axios.get("/borrow/my-borrows");
    setMyBorrows(res.data);
  };

  const fetchHistory = async () => {
    const res = await axios.get("/borrow/history");
    setHistory(res.data);
  };

  // ================= ACTIONS =================
  const borrowBook = async (id) => {
    await axios.post(`/borrow/${id}`);
    toast.success("Book borrowed!");
    fetchBooks();
    fetchMyBorrows();
  };

  const reserveBook = async (id) => {
    await axios.post(`/books/reserve/${id}`);
    toast.success("Book reserved!");
    fetchBooks();
  };

  const returnBook = async (id) => {
    await axios.put(`/borrow/return/${id}`);
    toast.success("Book returned!");
    fetchBooks();
    fetchMyBorrows();
    fetchHistory();
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    fetchBooks();
    fetchMyBorrows();
    fetchHistory();
  }, []);

  return (
    <div className="dashboard-layout">

      {/* ================= SIDEBAR ================= */}
      <div className="sidebar">
        <h2>📚 Library</h2>
        <button>All Books</button>
        <button>My Books</button>
        <button>History</button>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* ================= MAIN ================= */}
      <div className="dashboard-container">

        {/* HEADER */}
        <div className="dashboard-header">
          <h2>Member Dashboard</h2>
        </div>

        {/* ================= BOOKS ================= */}
        <h3>📚 Books</h3>
        <div className="book-grid">
          {books.map((book) => (
            <motion.div
              key={book._id}
              className="book-card"
              whileHover={{ scale: 1.05 }}
            >
              <img
                src={bookImages[book.title] || "/default.jpg"}
                className="book-image"
                alt=""
              />

              <h4>{book.title}</h4>
              <p>{book.author}</p>

              <p>
                <strong>
                  {book.available ? "Available" : "Borrowed"}
                </strong>
              </p>

              {book.available ? (
                <button
                  className="borrow-btn"
                  onClick={() => borrowBook(book._id)}
                >
                  Borrow
                </button>
              ) : book.isReserved ? (
                <button className="borrowed-btn" disabled>
                  Reserved
                </button>
              ) : (
                <button
                  className="return-btn"
                  onClick={() => reserveBook(book._id)}
                >
                  Reserve
                </button>
              )}
            </motion.div>
          ))}
        </div>

        {/* ================= MY BORROWS ================= */}
        <h3>📦 My Borrowed Books</h3>

        {myBorrows.length === 0 && <p>No borrowed books</p>}

        <div className="book-grid">
          {myBorrows.map((b) => (
            <motion.div
              key={b._id}
              className="book-card"
              whileHover={{ scale: 1.05 }}
            >
              <img
                src={bookImages[b.book?.title] || "/default.jpg"}
                className="book-image"
                alt=""
              />

              <h4>{b.book?.title}</h4>
              <p>{b.book?.author}</p>

              <p>
                Due: {new Date(b.dueDate).toDateString()}
              </p>

              <button
                className="return-btn"
                onClick={() => returnBook(b._id)}
              >
                Return
              </button>
            </motion.div>
          ))}
        </div>

        {/* ================= HISTORY ================= */}
        <h3>📜 Borrow History</h3>

        {history.length === 0 ? (
          <p>No history yet</p>
        ) : (
          <div className="book-grid">
            {history.map((h) => (
              <div key={h._id} className="book-card">
                <h4>{h.book?.title}</h4>
                <p>{h.book?.author}</p>

                <p>
                  Status:{" "}
                  <strong>
                    {h.returned ? "Returned" : "Borrowed"}
                  </strong>
                </p>

                <p>Fine: ₹{h.fine || 0}</p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default MemberDashboard;