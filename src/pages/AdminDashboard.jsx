import { useState, useEffect } from "react";
import axios from "../api/axios";
import "../styles/adminDashboard.css";
import { useAuth } from "../context/AuthContext";
import DashboardCharts from "../components/DashboardCharts";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

/* ================= BOOK IMAGES ================= */
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
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    isbn: "",
    genre: "",
    publicationYear: "",
  });

  const [editBook, setEditBook] = useState(null);

  const authHeaders = () => ({
    headers: {
      Authorization: `Bearer ${user?.token}`,
    },
  });

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  /* ================= FETCH ================= */
  const fetchBooks = async () => {
    const res = await axios.get("/books", authHeaders());
    setBooks(res.data);
  };

  const fetchUsers = async () => {
    const res = await axios.get("/users", authHeaders());
    setUsers(res.data);
  };

  const loadDashboard = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchBooks(), fetchUsers()]);
    } catch {
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) loadDashboard();
  }, [user]);

  /* ================= CRUD ================= */
  const addBook = async () => {
    try {
      await axios.post("/books", newBook, authHeaders());
      toast.success("Book added");

      setNewBook({
        title: "",
        author: "",
        isbn: "",
        genre: "",
        publicationYear: "",
      });

      fetchBooks();
    } catch {
      toast.error("Failed to add book");
    }
  };

  const deleteBook = async (id) => {
    try {
      await axios.delete(`/books/${id}`, authHeaders());
      toast.success("Book deleted");
      fetchBooks();
    } catch {
      toast.error("Delete failed");
    }
  };

  const updateBook = async () => {
    try {
      await axios.put(`/books/${editBook._id}`, editBook, authHeaders());
      toast.success("Book updated");
      setEditBook(null);
      fetchBooks();
    } catch {
      toast.error("Update failed");
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`/users/${id}`, authHeaders());
      toast.success("User deleted");
      fetchUsers();
    } catch {
      toast.error("Delete user failed");
    }
  };

  /* ================= FILTER ================= */
  let filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(search.toLowerCase())
  );

  if (filter === "available") {
    filteredBooks = filteredBooks.filter((b) => b.available);
  }

  if (filter === "borrowed") {
    filteredBooks = filteredBooks.filter((b) => !b.available);
  }

  /* ================= IMAGE ================= */
  const getBookImage = (title) => {
    const key = Object.keys(bookImages).find(
      (k) => k.toLowerCase() === title?.trim().toLowerCase()
    );

    return key ? bookImages[key] : "/default.jpg";
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="admin-container">
        <h2>Loading Dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="admin-container">

      {/* HEADER */}
      <div className="admin-header">
        <h2>👑 Welcome {user?.name}</h2>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* STATS */}
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

      {/* ================= NEW CHARTS (STEP 2) ================= */}
      <h3>📊 Library Analytics</h3>
      <DashboardCharts books={books} />

      {/* SEARCH */}
      <input
        className="search-bar"
        placeholder="Search books..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* FILTER */}
      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="all">All</option>
        <option value="available">Available</option>
        <option value="borrowed">Borrowed</option>
      </select>

      {/* ADD BOOK */}
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

        <button onClick={addBook}>Add</button>
      </div>

      {/* BOOKS */}
      <h3>📚 All Books</h3>

      <div className="book-grid">
        {filteredBooks.map((book) => (
          <motion.div
            key={book._id}
            className="book-card"
            whileHover={{ scale: 1.04 }}
          >
            <img
              src={getBookImage(book.title)}
              alt={book.title}
              className="book-image"
              onError={(e) => {
                e.target.src = "/default.jpg";
              }}
            />

            <h4>{book.title}</h4>
            <p>{book.author}</p>
            <p>
              {book.available ? "🟢 Available" : "🔴 Borrowed"}
            </p>

            <button onClick={() => setEditBook(book)}>
              Edit
            </button>

            <button onClick={() => deleteBook(book._id)}>
              Delete
            </button>
          </motion.div>
        ))}
      </div>

      {/* USERS */}
      <h3>👥 Users</h3>

      <div className="user-grid">
        {users.map((u) => (
          <motion.div
            key={u._id}
            className="user-card"
            whileHover={{ scale: 1.04 }}
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