import { useState, useEffect } from "react";
import axios from "../api/axios";
import "../styles/adminDashboard.css";
import { useAuth } from "../context/AuthContext";
import DashboardCharts from "../components/DashboardCharts";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const defaultImages = {
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

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [userSearch, setUserSearch] = useState("");

  const [imageFile, setImageFile] = useState(null);

  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    isbn: "",
    genre: "",
    publicationYear: "",
    totalCopies: 1,
    price: "",
    description: "",
  });

  const [editBook, setEditBook] = useState(null);

  /* ================= AUTH HEADERS ================= */

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

  /* ================= FETCH BOOKS ================= */

  const fetchBooks = async () => {
    try {
      const res = await axios.get(
        "/books",
        authHeaders()
      );

      setBooks(
        Array.isArray(res.data)
          ? res.data
          : res.data.books || []
      );
    } catch (error) {
      toast.error("Failed to fetch books");
    }
  };

  /* ================= FETCH USERS ================= */
  const fetchUsers = async () => {
  try {

    const res = await axios.get(
      "/users",
      {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      }
    );

    console.log(res.data);

    setUsers(
      Array.isArray(res.data)
        ? res.data
        : res.data.users || []
    );

  } catch (error) {

    console.log(error);

    toast.error(
      "Failed to fetch users"
    );
  }
};
  /* ================= FETCH TRANSACTIONS ================= */

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(
        "/transactions/all",
        authHeaders()
      );

      setTransactions(res.data || []);
    } catch (error) {
      toast.error("Failed to fetch transactions");
    }
  };

  /* ================= LOAD DASHBOARD ================= */

  const loadDashboard = async () => {
    try {
      setLoading(true);

      await Promise.all([
        fetchBooks(),
        fetchUsers(),
        fetchTransactions(),
      ]);
    } catch (error) {
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

  /* ================= ADD BOOK ================= */

  const addBook = async () => {
    try {
      if (
        !newBook.title ||
        !newBook.author
      ) {
        return toast.error(
          "Title and author required"
        );
      }

      const formData = new FormData();

      Object.keys(newBook).forEach(
        (key) => {
          formData.append(
            key,
            newBook[key]
          );
        }
      );

      if (imageFile) {
        formData.append(
          "coverImage",
          imageFile
        );
      }

      await axios.post(
        "/books",
        formData,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      toast.success(
        "Book added successfully"
      );

      setNewBook({
        title: "",
        author: "",
        isbn: "",
        genre: "",
        publicationYear: "",
        totalCopies: 1,
        price: "",
        description: "",
      });

      setImageFile(null);

      fetchBooks();
    } catch (error) {
      toast.error(
        error.response?.data
          ?.message ||
          "Failed to add book"
      );
    }
  };

  /* ================= DELETE BOOK ================= */

  const deleteBook = async (id) => {
    if (
      !window.confirm(
        "Delete this book?"
      )
    )
      return;

    try {
      await axios.delete(
        `/books/${id}`,
        authHeaders()
      );

      toast.success(
        "Book deleted successfully"
      );

      fetchBooks();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  /* ================= UPDATE BOOK ================= */

  const updateBook = async () => {
    try {
      await axios.put(
        `/books/${editBook._id}`,
        editBook,
        authHeaders()
      );

      toast.success(
        "Book updated successfully"
      );

      setEditBook(null);

      fetchBooks();
    } catch (error) {
      toast.error("Update failed");
    }
  };

  /* ================= DELETE USER ================= */

  const deleteUser = async (id) => {
    if (
      !window.confirm(
        "Delete this user?"
      )
    )
      return;

    try {
      await axios.delete(
        `/users/${id}`,
        authHeaders()
      );

      toast.success(
        "User deleted successfully"
      );

      fetchUsers();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  /* ================= FILTER BOOKS ================= */

  let filteredBooks = books.filter(
    (book) =>
      book.title
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        ) ||
      book.author
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
  );

  if (filter === "available") {
    filteredBooks =
      filteredBooks.filter(
        (b) =>
          b.availableCopies > 0
      );
  }

  if (filter === "borrowed") {
    filteredBooks =
      filteredBooks.filter(
        (b) =>
          b.availableCopies <= 0
      );
  }

  /* ================= IMAGE ================= */

  const getBookImage = (
    title
  ) => {
    const key = Object.keys(
      defaultImages
    ).find(
      (k) =>
        k.toLowerCase() ===
        title
          ?.trim()
          .toLowerCase()
    );

    return key
      ? defaultImages[key]
      : "/default.jpg";
  };

  /* ================= ANALYTICS ================= */

  const availableBooks =
    books.filter(
      (b) =>
        b.availableCopies > 0
    ).length;

  const borrowedBooks =
    books.filter(
      (b) =>
        b.availableCopies <= 0
    ).length;

  const activeBorrows =
    transactions.filter(
      (t) =>
        t.status ===
        "borrowed"
    ).length;

  const overdueBooks =
    transactions.filter(
      (t) =>
        t.status ===
          "borrowed" &&
        new Date(t.dueDate) <
          new Date()
    ).length;

  const revenue =
    transactions.reduce(
      (sum, t) =>
        sum + (t.fine || 0),
      0
    );

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="admin-container">
        <h2>
          Loading Dashboard...
        </h2>
      </div>
    );
  }

  return (
    <div className="admin-container">

      {/* ================= HEADER ================= */}

      <div className="admin-header">

        <h2>
          👑 Welcome {user?.name}
        </h2>

        <div className="header-buttons">

          <button
            className="refresh-btn"
            onClick={
              loadDashboard
            }
          >
            🔄 Refresh
          </button>

          <button
            className="logout-btn"
            onClick={
              handleLogout
            }
          >
            Logout
          </button>

        </div>
      </div>

      {/* ================= STATS ================= */}

      <div className="stats-container">

        <div className="stat-card">
          <h4>Total Books</h4>
          <p>{books.length}</p>
        </div>

        <div className="stat-card">
          <h4>Available</h4>
          <p>
            {availableBooks}
          </p>
        </div>

        <div className="stat-card">
          <h4>Borrowed</h4>
          <p>
            {borrowedBooks}
          </p>
        </div>

        <div className="stat-card">
          <h4>Users</h4>
          <p>{users.length}</p>
        </div>

        <div className="stat-card">
          <h4>Active Borrows</h4>
          <p>
            {activeBorrows}
          </p>
        </div>

        <div className="stat-card">
          <h4>Overdue</h4>
          <p>
            {overdueBooks}
          </p>
        </div>

        <div className="stat-card">
          <h4>Revenue</h4>
          <p>₹{revenue}</p>
        </div>

      </div>

      {/* ================= CHARTS ================= */}

      <h3>
        📊 Library Analytics
      </h3>

      <DashboardCharts
        books={books}
      />

      {/* ================= SEARCH ================= */}

      <div className="filter-bar">

        <input
          type="text"
          placeholder="Search books..."
          className="search-bar"
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
        />

        <select
          value={filter}
          onChange={(e) =>
            setFilter(
              e.target.value
            )
          }
        >
          <option value="all">
            All
          </option>

          <option value="available">
            Available
          </option>

          <option value="borrowed">
            Borrowed
          </option>

        </select>

      </div>

      {/* ================= ADD BOOK ================= */}

      <div className="add-book-section">

        <h3>
          ➕ Add New Book
        </h3>

        <div className="add-book-form">

          <input
            type="text"
            placeholder="Title"
            value={newBook.title}
            onChange={(e) =>
              setNewBook({
                ...newBook,
                title:
                  e.target.value,
              })
            }
          />

          <input
            type="text"
            placeholder="Author"
            value={newBook.author}
            onChange={(e) =>
              setNewBook({
                ...newBook,
                author:
                  e.target.value,
              })
            }
          />

          <input
            type="text"
            placeholder="ISBN"
            value={newBook.isbn}
            onChange={(e) =>
              setNewBook({
                ...newBook,
                isbn:
                  e.target.value,
              })
            }
          />

          <input
            type="text"
            placeholder="Genre"
            value={newBook.genre}
            onChange={(e) =>
              setNewBook({
                ...newBook,
                genre:
                  e.target.value,
              })
            }
          />

          <input
            type="number"
            placeholder="Publication Year"
            value={
              newBook.publicationYear
            }
            onChange={(e) =>
              setNewBook({
                ...newBook,
                publicationYear:
                  e.target.value,
              })
            }
          />

          <input
            type="number"
            placeholder="Total Copies"
            value={
              newBook.totalCopies
            }
            onChange={(e) =>
              setNewBook({
                ...newBook,
                totalCopies:
                  e.target.value,
              })
            }
          />

          <input
            type="number"
            placeholder="Price"
            value={newBook.price}
            onChange={(e) =>
              setNewBook({
                ...newBook,
                price:
                  e.target.value,
              })
            }
          />

          <textarea
            placeholder="Description"
            value={
              newBook.description
            }
            onChange={(e) =>
              setNewBook({
                ...newBook,
                description:
                  e.target.value,
              })
            }
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setImageFile(
                e.target.files[0]
              )
            }
          />

          <button
            onClick={addBook}
          >
            Add Book
          </button>

        </div>
      </div>

      {/* ================= BOOK LIST ================= */}

      <h3>📚 All Books</h3>

      <div className="book-grid">

        {filteredBooks.length ===
        0 ? (
          <p>
            No books found
          </p>
        ) : (
          filteredBooks.map(
            (book) => (
              <motion.div
                key={book._id}
                className="book-card"
                whileHover={{
                  scale: 1.04,
                }}
              >

                <img
                  src={
                    book.coverImage ||
                    getBookImage(
                      book.title
                    )
                  }
                  alt={book.title}
                  className="book-image"
                  onError={(e) =>
                    (e.target.src =
                      "/default.jpg")
                  }
                />

                <h4>
                  {book.title}
                </h4>

                <p>
                  ✍{" "}
                  {book.author}
                </p>

                <p>
                  📚{" "}
                  {book.genre}
                </p>

                <p>
                  Copies:{" "}
                  {
                    book.availableCopies
                  }
                </p>

                <p>
                  {book.availableCopies >
                  0
                    ? "🟢 Available"
                    : "🔴 Borrowed"}
                </p>

                <div className="book-actions">

                  <button
                    onClick={() =>
                      setEditBook(
                        book
                      )
                    }
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      deleteBook(
                        book._id
                      )
                    }
                  >
                    Delete
                  </button>

                </div>

              </motion.div>
            )
          )
        )}

      </div>

      {/* ================= EDIT BOOK ================= */}

      {editBook && (
        <div className="edit-modal">

          <div className="edit-box">

            <h3>
              ✏️ Edit Book
            </h3>

            <input
              type="text"
              placeholder="Title"
              value={
                editBook.title
              }
              onChange={(e) =>
                setEditBook({
                  ...editBook,
                  title:
                    e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="Author"
              value={
                editBook.author
              }
              onChange={(e) =>
                setEditBook({
                  ...editBook,
                  author:
                    e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="Genre"
              value={
                editBook.genre
              }
              onChange={(e) =>
                setEditBook({
                  ...editBook,
                  genre:
                    e.target.value,
                })
              }
            />

            <input
              type="number"
              placeholder="Available Copies"
              value={
                editBook.availableCopies
              }
              onChange={(e) =>
                setEditBook({
                  ...editBook,
                  availableCopies:
                    Number(
                      e.target.value
                    ),
                })
              }
            />

            <div className="edit-buttons">

              <button
                className="save-btn"
                onClick={
                  updateBook
                }
              >
                Save
              </button>

              <button
                className="cancel-btn"
                onClick={() =>
                  setEditBook(
                    null
                  )
                }
              >
                Cancel
              </button>

            </div>

          </div>
        </div>
      )}

      {/* ================= USERS ================= */}

      <h3>👥 Users</h3>

      <input
        type="text"
        placeholder="Search users..."
        className="search-bar"
        value={userSearch}
        onChange={(e) =>
          setUserSearch(
            e.target.value
          )
        }
      />

      <div className="user-grid">

        {users
          .filter((u) =>
            u.name
              ?.toLowerCase()
              .includes(
                userSearch.toLowerCase()
              )
          )
          .map((u) => (
            <motion.div
              key={u._id}
              className="user-card"
              whileHover={{
                scale: 1.03,
              }}
            >

              <h4>{u.name}</h4>

              <p>{u.email}</p>

              <p>
                {u.role}
              </p>

              <button
                onClick={() =>
                  deleteUser(
                    u._id
                  )
                }
              >
                Delete
              </button>

            </motion.div>
          ))}

      </div>

      {/* ================= TRANSACTIONS ================= */}

      <h3>
        📄 Recent Borrow Activity
      </h3>

      <div className="recent-activity">

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
              .slice(0, 10)
              .map((t) => (
                <tr
                  key={t._id}
                >

                  <td>
                    {
                      t.user
                        ?.name
                    }
                  </td>

                  <td>
                    {
                      t.book
                        ?.title
                    }
                  </td>

                  <td>
                    {t.status}
                  </td>

                  <td>
                    {t.dueDate
                      ? new Date(
                          t.dueDate
                        ).toLocaleDateString()
                      : "-"}
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