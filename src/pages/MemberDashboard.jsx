import { useState, useEffect } from "react";
import axios from "../api/axios";
import "../styles/memberDashboard.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// ✅ Book images mapping
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

  // ================= FETCH BOOKS =================
  const fetchBooks = async () => {
    try {
      const res = await axios.get("/books");
      setBooks(res.data);
    } catch (err) {
      alert("Error fetching books");
    }
  };

  // ================= FETCH MY BORROWS =================
  const fetchMyBorrows = async () => {
    try {
      const res = await axios.get("/borrow/my-borrows");
      setMyBorrows(res.data);
    } catch (err) {
      alert("Error fetching your borrows");
    }
  };

  // ================= BORROW =================
  const borrowBook = async (id) => {
    try {
      await axios.post(`/borrow/${id}`);
      alert("Book borrowed!");
      fetchBooks();
      fetchMyBorrows();
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  // ================= RESERVE =================
  const reserveBook = async (id) => {
    try {
      await axios.post(`/books/reserve/${id}`);
      alert("Reserved!");
      fetchBooks();
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  // ================= RETURN =================
  const returnBook = async (id) => {
    try {
      await axios.put(`/borrow/return/${id}`);
      alert("Returned!");
      fetchBooks();
      fetchMyBorrows();
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

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
      <div className="dashboard-header">
        <h2>📚 Member Dashboard</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>

      {/* ================= BOOKS ================= */}
      <h3>Books</h3>

      <div className="book-grid">
        {books.map((book) => (
          <motion.div
            key={book._id}
            className="book-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
          >
            {/* ✅ BOOK IMAGE */}
            <img
              src={bookImages[book.title] || "/default.jpg"}
              alt={book.title}
              className="book-image"
              onError={(e) => (e.target.src = "/default.jpg")} // fallback
            />

            <h4>{book.title}</h4>
            <p>{book.author}</p>

            <p>
              Status:{" "}
              <strong>
                {book.available ? "Available" : "Borrowed"}
              </strong>
            </p>

            {book.available ? (
              <button onClick={() => borrowBook(book._id)}>
                Borrow
              </button>
            ) : book.isReserved ? (
              <button disabled>Reserved</button>
            ) : (
              <button onClick={() => reserveBook(book._id)}>
                Reserve
              </button>
            )}
          </motion.div>
        ))}
      </div>

      {/* ================= MY BORROWS ================= */}
      <h3>My Borrowed Books</h3>

      {myBorrows.length === 0 && <p>No borrowed books</p>}

      <motion.div
        className="book-grid"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
      >
        {myBorrows.map((b) => (
          <motion.div
            key={b._id}
            className="book-card"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            whileHover={{ scale: 1.05 }}
          >
            {/* ✅ IMAGE ALSO IN BORROW */}
            <img
              src={bookImages[b.book?.title] || "/default.jpg"}
              alt={b.book?.title}
              className="book-image"
            />

            <h4>{b.book?.title}</h4>
            <p>{b.book?.author}</p>

            <p>
              Due: {new Date(b.dueDate).toDateString()}
            </p>

            <button onClick={() => returnBook(b._id)}>
              Return
            </button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default MemberDashboard;