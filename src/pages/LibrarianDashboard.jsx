import { useState, useEffect } from "react";
import axios from "axios";
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

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    navigate("/login");
  };

  const fetchBooks = async () => {
    const res = await axios.get("https://library-management-backend-0un8.onrender.com/api/books", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setBooks(res.data);
  };

  const addBook = async (e) => {
    e.preventDefault();
    await axios.post(
      "https://library-management-backend-0un8.onrender.com/api/books",
      { title, author },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setTitle("");
    setAuthor("");
    fetchBooks();
  };

  const deleteBook = async (id) => {
    await axios.delete(`https://library-management-backend-0un8.onrender.com/api/books/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchBooks();
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="dashboard-container">

      {/* ✅ Logout Button */}
      <div style={{ textAlign: "right" }}>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <h2>📚 Librarian Dashboard</h2>

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
    </div>
  );
};

export default LibrarianDashboard;