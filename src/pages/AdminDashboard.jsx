import { useState, useEffect } from "react";
import axios from "../api/axios";
import "../styles/admindashboard.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

/* ✅ IMAGE MAP */
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

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    isbn: "",
    genre: "",
    publicationYear: "",
  });

  const [editBook, setEditBook] = useState(null);

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
    } catch {
      alert("Error fetching books");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/auth/users");
      setUsers(res.data);
    } catch {
      alert("Error fetching users");
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchUsers();
  }, []);

  /* ================= FILTER ================= */
  let filteredBooks = books.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase())
  );

  if (filter === "available") {
    filteredBooks = filteredBooks.filter((b) => b.available);
  } else if (filter === "borrowed") {
    filteredBooks = filteredBooks.filter((b) => !b.available);
  }

  /* ================= ADD ================= */
  const addBook = async () => {
    try {
      await axios.post("/books", newBook);
      setNewBook({
        title: "",
        author: "",
        isbn: "",
        genre: "",
        publicationYear: "",
      });
      fetchBooks();
    } catch {
      alert("Failed to add book");
    }
  };

  /* ================= DELETE ================= */
  const deleteBook = async (id) => {
    try {
      await axios.delete(`/books/${id}`);
      fetchBooks();
    } catch {
      alert("Delete failed");
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`/auth/users/${id}`);
      fetchUsers();
    } catch {
      alert("Delete user failed");
    }
  };

  /* ================= UPDATE ================= */
  const updateBook = async () => {
    try {
      await axios.put(`/books/${editBook._id}`, editBook);
      setEditBook(null);
      fetchBooks();
    } catch {
      alert("Update failed");
    }
  };

  return (
    <div className="admin-container">

      {/* ================= HEADER ================= */}
      <div className="admin-header">
        <h2>👑 Admin Dashboard</h2>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* ================= STATS ================= */}
      <div className="stats-container">
        <div className="stat-card">
          <h4>Total Books</h4>
          <p>{books.length}</p>
        </div>

        <div className="stat-card">
          <h4>Available</h4>
          <p>{books.filter((b) => b.available).length}</p>
        </div>

        <div className="stat-card">
          <h4>Borrowed</h4>
          <p>{books.filter((b) => !b.available).length}</p>
        </div>

        <div className="stat-card">
          <h4>Users</h4>
          <p>{users.length}</p>
        </div>
      </div>

      {/* ================= SEARCH + FILTER ================= */}
      <input
        className="search-bar"
        placeholder="🔍 Search books..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select onChange={(e) => setFilter(e.target.value)}>
        <option value="all">All</option>
        <option value="available">Available</option>
        <option value="borrowed">Borrowed</option>
      </select>

      {/* ================= ADD BOOK ================= */}
      <h3>➕ Add Book</h3>
      <div className="add-book-form">
        <input
          placeholder="Title"
          value={newBook.title}
          onChange={(e) =>
            setNewBook({ ...newBook, title: e.target.value })
          }
        />
        <input
          placeholder="Author"
          value={newBook.author}
          onChange={(e) =>
            setNewBook({ ...newBook, author: e.target.value })
          }
        />
        <input
          placeholder="ISBN"
          value={newBook.isbn}
          onChange={(e) =>
            setNewBook({ ...newBook, isbn: e.target.value })
          }
        />
        <input
          placeholder="Genre"
          value={newBook.genre}
          onChange={(e) =>
            setNewBook({ ...newBook, genre: e.target.value })
          }
        />
        <input
          placeholder="Year"
          value={newBook.publicationYear}
          onChange={(e) =>
            setNewBook({
              ...newBook,
              publicationYear: e.target.value,
            })
          }
        />

        <button onClick={addBook}>Add Book</button>
      </div>

      {/* ================= BOOK LIST ================= */}
      <h3>📚 All Books</h3>

      <div className="book-grid">
        {filteredBooks.map((b) => (
          <motion.div
            key={b._id}
            className="book-card"
            whileHover={{ scale: 1.05 }}
          >
            <img
              src={bookImages[b.title] || "/default.jpg"}
              alt={b.title}
              className="book-image"
              onError={(e) => (e.target.src = "/default.jpg")}
            />

            <h4>{b.title}</h4>
            <p>{b.author}</p>

            <p>
              {b.available ? "🟢 Available" : "🔴 Borrowed"}
            </p>

            <button onClick={() => setEditBook(b)}>
              Edit
            </button>

            <button onClick={() => deleteBook(b._id)}>
              Delete
            </button>
          </motion.div>
        ))}
      </div>

      {filteredBooks.length === 0 && <p>No books found 📭</p>}

      {/* ================= EDIT POPUP ================= */}
      {editBook && (
        <div className="edit-popup">
          <h3>Edit Book</h3>

          <input
            value={editBook.title}
            onChange={(e) =>
              setEditBook({ ...editBook, title: e.target.value })
            }
          />
          <input
            value={editBook.author}
            onChange={(e) =>
              setEditBook({ ...editBook, author: e.target.value })
            }
          />

          <button onClick={updateBook}>Update</button>
          <button onClick={() => setEditBook(null)}>
            Cancel
          </button>
        </div>
      )}

      {/* ================= USERS ================= */}
      <h3>👥 Users</h3>

      <div className="user-grid">
        {users.map((u) => (
          <motion.div
            key={u._id}
            className="user-card"
            whileHover={{ scale: 1.05 }}
          >
            <h4>{u.name}</h4>
            <p>{u.email}</p>
            <p>{u.role}</p>

            <button onClick={() => deleteUser(u._id)}>
              Delete
            </button>
          </motion.div>
        ))}
      </div>

    </div>
  );
};

export default AdminDashboard;