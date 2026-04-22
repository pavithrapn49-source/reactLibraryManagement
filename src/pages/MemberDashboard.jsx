import { useState, useEffect } from "react";
import axios from "../api/axios";
import "../styles/memberDashboard.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
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

const MemberDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [myBorrows, setMyBorrows] = useState([]);
  const [history, setHistory] = useState([]);
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

  const fetchMyBorrows = async () => {
    const res = await axios.get(
      "/transactions/my-borrows",
      authHeaders()
    );
    setMyBorrows(Array.isArray(res.data) ? res.data : res.data.borrows || []);
  };

  const fetchHistory = async () => {
    const res = await axios.get(
      "/transactions/history",
      authHeaders()
    );
    setHistory(Array.isArray(res.data) ? res.data : res.data.history || []);
  };

  const loadDashboard = async () => {
    try {
      setLoading(true);

      await Promise.all([
        fetchBooks(),
        fetchMyBorrows(),
        fetchHistory(),
      ]);
    } catch {
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) loadDashboard();
  }, [user]);

  /* ================= ACTIONS ================= */
  const borrowBook = async (id) => {
    try {
      await axios.post(
        `/transactions/borrow/${id}`,
        {},
        authHeaders()
      );

      toast.success("Book borrowed!");
      loadDashboard();
    } catch {
      toast.error("Borrow failed");
    }
  };

  const reserveBook = async (id) => {
    try {
      await axios.post(
        `/books/reserve/${id}`,
        {},
        authHeaders()
      );

      toast.success("Book reserved!");
    } catch {
      toast.error("Reserve failed");
    }
  };

  const returnBook = async (id) => {
    try {
      await axios.post(
        `/transactions/return/${id}`,
        {},
        authHeaders()
      );

      toast.success("Book returned!");
      loadDashboard();
    } catch {
      toast.error("Return failed");
    }
  };

  /* ================= ANALYTICS ================= */
  const chartData = [
    {
      name: "Borrowed",
      value: myBorrows.length,
    },
    {
      name: "Returned",
      value: history.filter((h) => h.returned).length,
    },
    {
      name: "Available",
      value: books.filter((b) => b.available).length,
    },
  ];

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="dashboard-container">
        <h2>Loading Dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      {/* SIDEBAR */}
      <div className="sidebar">
        <h2>📚 Library</h2>

        <button
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            })
          }
        >
          Books
        </button>

        <button
          onClick={() =>
            document
              .getElementById("my-borrows")
              ?.scrollIntoView({
                behavior: "smooth",
              })
          }
        >
          My Books
        </button>

        <button
          onClick={() =>
            document
              .getElementById("history")
              ?.scrollIntoView({
                behavior: "smooth",
              })
          }
        >
          History
        </button>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {/* MAIN */}
      <div className="dashboard-container">
        <h2>👋 Welcome {user?.name}</h2>

        {/* STATS */}
        <div className="stats-container">
          <div className="stat-card">
            <h4>Available Books</h4>
            <p>
              {
                books.filter((b) => b.available)
                  .length
              }
            </p>
          </div>

          <div className="stat-card">
            <h4>My Borrowed</h4>
            <p>{myBorrows.length}</p>
          </div>

          <div className="stat-card">
            <h4>History</h4>
            <p>{history.length}</p>
          </div>
        </div>

        {/* CHART */}
        <h3>📊 My Analytics</h3>

        <div className="stat-card" style={{ height: "320px" }}>
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                outerRadius={110}
                label
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={
                      COLORS[
                        index % COLORS.length
                      ]
                    }
                  />
                ))}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* BOOKS */}
        <h3>📚 Books</h3>

        <div className="book-grid">
          {books.map((book) => (
            <motion.div
              key={book._id}
              className="book-card"
              whileHover={{
                scale: 1.03,
              }}
            >
              <img
                src={getBookImage(book.title)}
                alt={book.title}
                className="book-image"
                onError={(e) => {
                  e.target.src =
                    "/default.jpg";
                }}
              />

              <h4>{book.title}</h4>
              <p>{book.author}</p>

              <p>
                {book.available
                  ? "🟢 Available"
                  : "🔴 Borrowed"}
              </p>

              {book.available ? (
                <button
                  className="borrow-btn"
                  onClick={() =>
                    borrowBook(book._id)
                  }
                >
                  Borrow
                </button>
              ) : (
                <button
                  className="reserve-btn"
                  onClick={() =>
                    reserveBook(book._id)
                  }
                >
                  Reserve
                </button>
              )}
            </motion.div>
          ))}
        </div>

        {/* MY BORROWS */}
        <h3 id="my-borrows">
          📦 My Borrowed Books
        </h3>

        <div className="book-grid">
          {myBorrows.map((item) => {
            const isLate =
              new Date() >
              new Date(item.dueDate);

            return (
              <motion.div
                key={item._id}
                className="book-card"
                whileHover={{
                  scale: 1.03,
                }}
              >
                <h4>
                  {item.book?.title}
                </h4>

                <p>
                  {item.book?.author}
                </p>

                <p>
                  Due:{" "}
                  {new Date(
                    item.dueDate
                  ).toDateString()}
                </p>

                <p
                  style={{
                    color: isLate
                      ? "red"
                      : "green",
                    fontWeight: "600",
                  }}
                >
                  {isLate
                    ? "⚠ Overdue"
                    : "On Time"}
                </p>

                <button
                  className="return-btn"
                  onClick={() =>
                    returnBook(
                      item._id
                    )
                  }
                >
                  Return
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* HISTORY */}
        <h3 id="history">
          📜 Borrow History
        </h3>

        <div className="book-grid">
          {history.map((item) => (
            <div
              key={item._id}
              className="book-card"
            >
              <h4>
                {item.book?.title}
              </h4>

              <p>
                {item.book?.author}
              </p>

              <p>
                {item.returned
                  ? "Returned"
                  : "Borrowed"}
              </p>

              <p>
                Fine ₹
                {item.fine || 0}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;