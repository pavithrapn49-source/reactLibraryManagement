import { useState, useEffect } from "react";
import axios from "../api/axios"; // ✅ use your axios instance
import "../styles/librarianDashboard.css";
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

const LibrarianDashboard = () => {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");

  const { logout } = useAuth();
  const navigate = useNavigate();

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  /* ================= FETCH ================= */
  const fetchBooks = async () => {
    try {
      const res = await axios.get("/books");
      setBooks(res.data);
    } catch (err) {
      alert("Failed to fetch books");
    }
  };

  /* ================= ADD ================= */
  const addBook = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/books", { title, author });
      setTitle("");
      setAuthor("");
      fetchBooks();
    } catch (err) {
      alert("Failed to add book");
    }
  };

  /* ================= DELETE ================= */
  const deleteBook = async (id) => {
    try {
      await axios.delete(`/books/${id}`);
      fetchBooks();
    } catch (err) {
      alert("Delete failed");
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="librarian-container">

      {/* 🔝 HEADER */}
      <div className="librarian-header">
        <h2>📚 Librarian Dashboard</h2>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* ➕ ADD BOOK */}
      <form onSubmit={addBook} className="add-book-form">
        <input
          placeholder="Book Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
        <button type="submit">Add Book</button>
      </form>

      {/* 📚 BOOK LIST */}
      <div className="book-grid">
        {books.map((b) => (
          <div key={b._id} className="book-card">
            <img
              src={bookImages[b.title] || "/default.jpg"}
              alt={b.title}
              className="book-image"
              onError={(e) => (e.target.src = "/default.jpg")}
            />

            <h4>{b.title}</h4>
            <p>{b.author}</p>

            <p className={b.available ? "available" : "borrowed"}>
              {b.available ? "🟢 Available" : "🔴 Borrowed"}
            </p>

            <button
              className="delete-btn"
              onClick={() => deleteBook(b._id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {books.length === 0 && <p>No books available 📭</p>}
    </div>
  );
};

export default LibrarianDashboard;