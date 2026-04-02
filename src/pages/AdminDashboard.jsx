import { useState, useEffect } from "react";
import axios from "../api/axios";
import "../styles/adminDashboard.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

// ✅ Book images
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

  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    isbn: "",
    genre: "",
    publicationYear: ""
  });

  const [editBook, setEditBook] = useState(null);

  const { logout } = useAuth();
  const navigate = useNavigate();

  // ================= LOGOUT =================
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // ================= FETCH BOOKS =================
  const fetchBooks = async () => {
    try {
      const res = await axios.get("/books");
      setBooks(res.data);
    } catch {
      alert("Error fetching books");
    }
  };

  // ================= FETCH USERS =================
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

  // ================= INPUT CHANGE =================
  const handleChange = (e) => {
    setNewBook({
      ...newBook,
      [e.target.name]: e.target.value
    });
  };

  // ================= ADD BOOK =================
  const addBook = async () => {
    try {
      await axios.post("/books", newBook);

      alert("Book added successfully");

      setNewBook({
        title: "",
        author: "",
        isbn: "",
        genre: "",
        publicationYear: ""
      });

      fetchBooks();
    } catch {
      alert("Failed to add book");
    }
  };

  // ================= DELETE BOOK =================
  const deleteBook = async (id) => {
    if (!window.confirm("Delete this book?")) return;

    try {
      await axios.delete(`/books/${id}`);
      fetchBooks();
    } catch {
      alert("Delete failed");
    }
  };

  // ================= DELETE USER =================
  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await axios.delete(`/auth/users/${id}`);
      fetchUsers();
    } catch {
      alert("Delete user failed");
    }
  };

  // ================= UPDATE BOOK =================
  const updateBook = async () => {
    try {
      await axios.put(`/books/${editBook._id}`, editBook);

      alert("Book updated successfully");

      setEditBook(null);
      fetchBooks();
    } catch {
      alert("Update failed");
    }
  };

  return (
    <div className="dashboard-container">

      {/* HEADER */}
      <div style={{ textAlign: "right" }}>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <h2>👑 Admin Dashboard</h2>

      {/* ================= STATS ================= */}
      <div className="stats-container">
        <div className="stat-card">
          <h4>Total Books</h4>
          <p>{books.length}</p>
        </div>

        <div className="stat-card">
          <h4>Available</h4>
          <p>{books.filter(b => b.available).length}</p>
        </div>

        <div className="stat-card">
          <h4>Borrowed</h4>
          <p>{books.filter(b => !b.available).length}</p>
        </div>

        <div className="stat-card">
          <h4>Total Users</h4>
          <p>{users.length}</p>
        </div>
      </div>

      {/* ================= ADD BOOK ================= */}
      <h3>Add New Book</h3>

      <div className="add-book-form">
        <input placeholder="Title" name="title" value={newBook.title} onChange={handleChange} />
        <input placeholder="Author" name="author" value={newBook.author} onChange={handleChange} />
        <input placeholder="ISBN" name="isbn" value={newBook.isbn} onChange={handleChange} />
        <input placeholder="Genre" name="genre" value={newBook.genre} onChange={handleChange} />
        <input placeholder="Year" name="publicationYear" value={newBook.publicationYear} onChange={handleChange} />

        <button onClick={addBook}>Add Book</button>
      </div>

      {/* ================= BOOK LIST ================= */}
      <h3 style={{ marginTop: "40px" }}>All Books</h3>

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
            <p>Author: {b.author}</p>
            <p>ISBN: {b.isbn}</p>
            <p>Genre: {b.genre}</p>
            <p>Year: {b.publicationYear}</p>

            {/* ✅ FIXED STATUS */}
            <p>
              Status:{" "}
              {b.available
                ? "Available"
                : b.isReserved
                ? "Reserved"
                : "Borrowed"}
            </p>

            <button onClick={() => setEditBook(b)}>Edit</button>
            <button onClick={() => deleteBook(b._id)}>Delete</button>
          </div>
        ))}
      </div>

      {/* ================= EDIT BOOK ================= */}
      {editBook && (
        <div className="edit-popup">
          <h3>Edit Book</h3>

          <input value={editBook.title} onChange={(e) => setEditBook({ ...editBook, title: e.target.value })} />
          <input value={editBook.author} onChange={(e) => setEditBook({ ...editBook, author: e.target.value })} />
          <input value={editBook.isbn} onChange={(e) => setEditBook({ ...editBook, isbn: e.target.value })} />
          <input value={editBook.genre} onChange={(e) => setEditBook({ ...editBook, genre: e.target.value })} />
          <input value={editBook.publicationYear} onChange={(e) => setEditBook({ ...editBook, publicationYear: e.target.value })} />

          <button onClick={updateBook}>Update</button>
          <button onClick={() => setEditBook(null)}>Cancel</button>
        </div>
      )}

      {/* ================= USERS ================= */}
      <h3 style={{ marginTop: "40px" }}>All Users</h3>

      <div className="user-grid">
        {users.map((u) => (
          <div key={u._id} className="user-card">
            <h4>{u.name}</h4>
            <p>{u.email}</p>
            <p>Role: {u.role}</p>

            <button onClick={() => deleteUser(u._id)}>
              Delete User
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};

export default AdminDashboard;