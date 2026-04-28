import { useState, useEffect } from "react";
import axios from "../api/axios";
import "../styles/adminDashboard.css";
import { useAuth } from "../context/AuthContext";
import DashboardCharts from "../components/DashboardCharts";
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

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);

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
    setBooks(Array.isArray(res.data) ? res.data : res.data.books || []);
  };

  const fetchUsers = async () => {
    const res = await axios.get("/users", authHeaders());
    setUsers(Array.isArray(res.data) ? res.data : res.data.users || []);
  };

  const fetchTransactions = async () => {
    const res = await axios.get("/transactions/all", authHeaders());
    setTransactions(res.data || []);
  };

  const loadDashboard = async () => {
    try {
      setLoading(true);

      await Promise.all([
        fetchBooks(),
        fetchUsers(),
        fetchTransactions(),
      ]);
    } catch {
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) {
      loadDashboard();
    }
  }, [user?.token]);

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
    if (!window.confirm("Delete this book?")) return;

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
      await axios.put(
        `/books/${editBook._id}`,
        editBook,
        authHeaders()
      );

      toast.success("Book updated");
      setEditBook(null);
      fetchBooks();
    } catch {
      toast.error("Update failed");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;

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

  /* ================= ANALYTICS ================= */
  const availableBooks = books.filter((b) => b.available).length;
  const borrowedBooks = books.filter((b) => !b.available).length;

  const activeBorrows = transactions.filter(
    (t) => t.status === "borrowed"
  ).length;

  const overdueBooks = transactions.filter(
    (t) =>
      t.status === "borrowed" &&
      new Date(t.dueDate) < new Date()
  ).length;

  const revenue = transactions
    .filter((t) => t.finePaid)
    .reduce((sum, t) => sum + (t.fine || 0), 0);

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

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            className="logout-btn"
            onClick={loadDashboard}
          >
            Refresh
          </button>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="stats-container">

        <div className="stat-card">
          <h4>Total Books</h4>
          <p>{books.length}</p>
        </div>

        <div className="stat-card">
          <h4>Available</h4>
          <p>{availableBooks}</p>
        </div>

        <div className="stat-card">
          <h4>Borrowed</h4>
          <p>{borrowedBooks}</p>
        </div>

        <div className="stat-card">
          <h4>Users</h4>
          <p>{users.length}</p>
        </div>

        <div className="stat-card">
          <h4>Active Borrows</h4>
          <p>{activeBorrows}</p>
        </div>

        <div className="stat-card">
          <h4>Overdue</h4>
          <p>{overdueBooks}</p>
        </div>

        <div className="stat-card">
          <h4>Fine Revenue</h4>
          <p>₹{revenue}</p>
        </div>

      </div>

      {/* CHARTS */}
      <h3>📊 Library Analytics</h3>
      <DashboardCharts books={books} />

      {/* SEARCH + FILTER */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <input
          className="search-bar"
          placeholder="Search books..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <select
          value={filter}
          onChange={(e) =>
            setFilter(e.target.value)
          }
        >
          <option value="all">All</option>
          <option value="available">
            Available
          </option>
          <option value="borrowed">
            Borrowed
          </option>
        </select>
      </div>

      {/* ADD BOOK */}
      <h3>➕ Add Book</h3>

      <div className="add-book-form">
        <input
          placeholder="Title"
          value={newBook.title}
          onChange={(e) =>
            setNewBook({
              ...newBook,
              title: e.target.value,
            })
          }
        />

        <input
          placeholder="Author"
          value={newBook.author}
          onChange={(e) =>
            setNewBook({
              ...newBook,
              author: e.target.value,
            })
          }
        />

        <input
          placeholder="ISBN"
          value={newBook.isbn}
          onChange={(e) =>
            setNewBook({
              ...newBook,
              isbn: e.target.value,
            })
          }
        />

        <input
          placeholder="Genre"
          value={newBook.genre}
          onChange={(e) =>
            setNewBook({
              ...newBook,
              genre: e.target.value,
            })
          }
        />

        <input
          placeholder="Year"
          value={newBook.publicationYear}
          onChange={(e) =>
            setNewBook({
              ...newBook,
              publicationYear:
                e.target.value,
            })
          }
        />

        <button onClick={addBook}>
          Add Book
        </button>
      </div>

      {/* BOOK LIST */}
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
              onError={(e) =>
                (e.target.src =
                  "/default.jpg")
              }
            />

            <h4>{book.title}</h4>
            <p>{book.author}</p>
            <p>{book.genre}</p>

            <p>
              {book.available
                ? "🟢 Available"
                : "🔴 Borrowed"}
            </p>

            <div
              style={{
                display: "flex",
                gap: "10px",
              }}
            >
              <button
                onClick={() =>
                  setEditBook(book)
                }
              >
                Edit
              </button>

              <button
                onClick={() =>
                  deleteBook(book._id)
                }
              >
                Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* EDIT BOOK */}
      {editBook && (
        <div className="edit-modal">
          <div className="edit-box">
            <h3>Edit Book</h3>

            <input
              value={editBook.title}
              onChange={(e) =>
                setEditBook({
                  ...editBook,
                  title:
                    e.target.value,
                })
              }
            />

            <input
              value={editBook.author}
              onChange={(e) =>
                setEditBook({
                  ...editBook,
                  author:
                    e.target.value,
                })
              }
            />

            <input
              value={editBook.genre}
              onChange={(e) =>
                setEditBook({
                  ...editBook,
                  genre:
                    e.target.value,
                })
              }
            />

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "10px",
              }}
            >
              <button onClick={updateBook}>
                Save
              </button>

              <button
                onClick={() =>
                  setEditBook(null)
                }
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* USERS */}
      <h3>👥 Users</h3>

      <div className="user-grid">
        {users.map((u) => (
          <motion.div
            key={u._id}
            className="user-card"
            whileHover={{ scale: 1.03 }}
          >
            <h4>{u.name}</h4>
            <p>{u.email}</p>
            <p>{u.role}</p>

            <button
              onClick={() =>
                deleteUser(u._id)
              }
            >
              Delete
            </button>
          </motion.div>
        ))}
      </div>

      {/* TRANSACTIONS */}
      <h3>📄 Recent Borrow Activity</h3>

      <div className="transaction-table">
        <table width="100%">
          <thead>
            <tr>
              <th>User</th>
              <th>Book</th>
              <th>Status</th>
              <th>Due Date</th>
            </tr>
          </thead>

          <tbody>
            {transactions
              .slice(0, 8)
              .map((t) => (
                <tr key={t._id}>
                  <td>
                    {t.user?.name}
                  </td>
                  <td>
                    {t.book?.title}
                  </td>
                  <td>
                    {t.status}
                  </td>
                  <td>
                    {new Date(
                      t.dueDate
                    ).toLocaleDateString()}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default AdminDashboard;