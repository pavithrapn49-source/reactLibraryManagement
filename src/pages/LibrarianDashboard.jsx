import { useState, useEffect } from "react";
import axios from "../api/axios";
import "../styles/librarianDashboard.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

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

const COLORS = ["#22c55e", "#ef4444", "#3b82f6"];

const LibrarianDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

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

  /* ================= IMAGE ================= */
  const getBookImage = (title) => {
    const key = Object.keys(bookImages).find(
      (k) => k.toLowerCase() === title?.trim().toLowerCase()
    );

    return key ? bookImages[key] : "/default.jpg";
  };

  /* ================= FETCH ================= */
  const fetchBooks = async () => {
    const res = await axios.get("/books", authHeaders());
    setBooks(Array.isArray(res.data) ? res.data : res.data.books || []);
  };

  const loadDashboard = async () => {
    try {
      setLoading(true);
      await fetchBooks();
    } catch {
      toast.error("Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) loadDashboard();
  }, [user]);

  /* ================= ACTIONS ================= */
  const markBorrowed = async (id) => {
    try {
      await axios.put(
        `/books/${id}/borrow`,
        {},
        authHeaders()
      );

      toast.success("Marked as borrowed");
      loadDashboard();
    } catch {
      toast.error("Update failed");
    }
  };

  const markReturned = async (id) => {
    try {
      await axios.put(
        `/books/${id}/return`,
        {},
        authHeaders()
      );

      toast.success("Marked as returned");
      loadDashboard();
    } catch {
      toast.error("Update failed");
    }
  };

  /* ================= FILTER ================= */
  let filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(search.toLowerCase())
  );

  if (filter === "available") {
    filteredBooks = filteredBooks.filter(
      (b) => b.available
    );
  }

  if (filter === "borrowed") {
    filteredBooks = filteredBooks.filter(
      (b) => !b.available
    );
  }

  /* ================= CHART DATA ================= */
  const statsData = [
    {
      name: "Available",
      value: books.filter(
        (b) => b.available
      ).length,
    },
    {
      name: "Borrowed",
      value: books.filter(
        (b) => !b.available
      ).length,
    },
  ];

  const monthlyData = [
    { name: "Books", total: books.length },
    {
      name: "Available",
      total: books.filter(
        (b) => b.available
      ).length,
    },
    {
      name: "Borrowed",
      total: books.filter(
        (b) => !b.available
      ).length,
    },
  ];

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="librarian-container">
        <h2>Loading Dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="librarian-container">
      {/* HEADER */}
      <div className="librarian-header">
        <h2>
          📖 Welcome {user?.name}
        </h2>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
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
          <p>
            {
              books.filter(
                (b) => b.available
              ).length
            }
          </p>
        </div>

        <div className="stat-card">
          <h4>Borrowed</h4>
          <p>
            {
              books.filter(
                (b) => !b.available
              ).length
            }
          </p>
        </div>
      </div>

      {/* CHARTS */}
      <h3>📊 Book Analytics</h3>

      <div
        className="stats-container"
        style={{
          gridTemplateColumns:
            "1fr 1fr",
        }}
      >
        <div
          className="stat-card"
          style={{
            height: "320px",
          }}
        >
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart
              data={monthlyData}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div
          className="stat-card"
          style={{
            height: "320px",
          }}
        >
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <PieChart>
              <Pie
                data={statsData}
                dataKey="value"
                outerRadius={100}
                label
              >
                {statsData.map(
                  (
                    item,
                    index
                  ) => (
                    <Cell
                      key={index}
                      fill={
                        COLORS[
                          index %
                            COLORS.length
                        ]
                      }
                    />
                  )
                )}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* SEARCH */}
      <input
        className="search-bar"
        placeholder="Search books..."
        value={search}
        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }
      />

      {/* FILTER */}
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

      {/* GRID */}
      <div className="book-grid">
        {filteredBooks.map(
          (book) => (
            <motion.div
              key={book._id}
              className="book-card"
              whileHover={{
                scale: 1.04,
              }}
            >
              <img
                src={getBookImage(
                  book.title
                )}
                alt={
                  book.title
                }
                className="book-image"
                onError={(
                  e
                ) => {
                  e.target.src =
                    "/default.jpg";
                }}
              />

              <h4>
                {book.title}
              </h4>

              <p>
                {book.author}
              </p>

              <p>
                {book.available
                  ? "🟢 Available"
                  : "🔴 Borrowed"}
              </p>

              {book.available ? (
                <button
                  onClick={() =>
                    markBorrowed(
                      book._id
                    )
                  }
                >
                  Mark Borrowed
                </button>
              ) : (
                <button
                  onClick={() =>
                    markReturned(
                      book._id
                    )
                  }
                >
                  Mark Returned
                </button>
              )}
            </motion.div>
          )
        )}
      </div>

      {filteredBooks.length ===
        0 && (
        <p>
          No books found 📭
        </p>
      )}
    </div>
  );
};

export default LibrarianDashboard;