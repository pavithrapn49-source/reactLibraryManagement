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
  const [dues, setDues] = useState([]);
  const [reservedBooks, setReservedBooks] = useState([]);
  const [search, setSearch] = useState("");
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
      (k) =>
        k.toLowerCase() ===
        title?.trim().toLowerCase()
    );

    return key ? bookImages[key] : "/default.jpg";
  };

  /* ================= FETCH ================= */
  const fetchBooks = async () => {
    const res = await axios.get(
      "/books",
      authHeaders()
    );

    setBooks(
      Array.isArray(res.data)
        ? res.data
        : res.data.books || []
    );
  };

  const fetchMyBorrows = async () => {
    const res = await axios.get(
      "/transactions/my-borrows",
      authHeaders()
    );

    setMyBorrows(
      Array.isArray(res.data)
        ? res.data
        : res.data.borrows || []
    );
  };

  const fetchHistory = async () => {
    const res = await axios.get(
      "/transactions/history",
      authHeaders()
    );

    setHistory(
      Array.isArray(res.data)
        ? res.data
        : res.data.history || []
    );
  };

  const fetchDues = async () => {
    const res = await axios.get(
      "/transactions/dues",
      authHeaders()
    );

    setDues(
      Array.isArray(res.data)
        ? res.data
        : res.data.dues || []
    );
  };

  const fetchReservedBooks = async () => {
    const res = await axios.get(
      "/books/reserved/my",
      authHeaders()
    );

    setReservedBooks(
      Array.isArray(res.data)
        ? res.data
        : res.data.books || []
    );
  };

  const loadDashboard = async () => {
    try {
      setLoading(true);

      await Promise.all([
        fetchBooks(),
        fetchMyBorrows(),
        fetchHistory(),
        fetchDues(),
        fetchReservedBooks(),
      ]);
    } catch {
      toast.error(
        "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) {
      loadDashboard();
    }
  }, [user?.token]);

  /* ================= ACTIONS ================= */
  const borrowBook = async (id) => {
    try {
      await axios.post(
        `/transactions/borrow/${id}`,
        {},
        authHeaders()
      );

      toast.success(
        "Book borrowed successfully"
      );

      loadDashboard();
    } catch (error) {
      toast.error(
        error?.response?.data
          ?.message ||
          "Borrow failed"
      );
    }
  };

  const reserveBook = async (id) => {
    try {
      await axios.post(
        `/books/reserve/${id}`,
        {},
        authHeaders()
      );

      toast.success(
        "Book reserved successfully"
      );

      loadDashboard();
    } catch (error) {
      toast.error(
        error?.response?.data
          ?.message ||
          "Reserve failed"
      );
    }
  };

  const returnBook = async (id) => {
    try {
      await axios.post(
        `/transactions/return/${id}`,
        {},
        authHeaders()
      );

      toast.success(
        "Book returned successfully"
      );

      loadDashboard();
    } catch (error) {
      toast.error(
        error?.response?.data
          ?.message ||
          "Return failed"
      );
    }
  };

  const renewBook = async (id) => {
    try {
      await axios.post(
        `/transactions/renew/${id}`,
        {},
        authHeaders()
      );

      toast.success(
        "Book renewed successfully"
      );

      loadDashboard();
    } catch (error) {
      toast.error(
        error?.response?.data
          ?.message ||
          "Renew failed"
      );
    }
  };

  const payFine = async (id) => {
    try {
      await axios.post(
        `/transactions/pay-fine/${id}`,
        {},
        authHeaders()
      );

      toast.success(
        "Fine paid successfully"
      );

      loadDashboard();
    } catch (error) {
      toast.error(
        error?.response?.data
          ?.message ||
          "Payment failed"
      );
    }
  };

  /* ================= FILTER ================= */
  const filteredBooks = books.filter(
    (book) =>
      book.title
        .toLowerCase()
        .includes(
          search.toLowerCase()
        ) ||
      book.author
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
  );

  /* ================= ANALYTICS ================= */
  const chartData = [
    {
      name: "Borrowed",
      value: myBorrows.length,
    },
    {
      name: "Returned",
      value: history.filter(
        (h) =>
          h.status === "returned"
      ).length,
    },
    {
      name: "Available",
      value: books.filter(
        (b) => b.available
      ).length,
    },
  ];

  const totalFine = dues.reduce(
    (sum, item) =>
      sum + (item.fine || 0),
    0
  );

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="dashboard-container">
        <h2>
          Loading Dashboard...
        </h2>
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
              behavior:
                "smooth",
            })
          }
        >
          Books
        </button>

        <button
          onClick={() =>
            document
              .getElementById(
                "my-borrows"
              )
              ?.scrollIntoView({
                behavior:
                  "smooth",
              })
          }
        >
          My Books
        </button>

        <button
          onClick={() =>
            document
              .getElementById(
                "history"
              )
              ?.scrollIntoView({
                behavior:
                  "smooth",
              })
          }
        >
          History
        </button>

        <button
          onClick={() =>
            document
              .getElementById(
                "dues"
              )
              ?.scrollIntoView({
                behavior:
                  "smooth",
              })
          }
        >
          Fines
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

      {/* MAIN */}
      <div className="dashboard-container">

        <h2>
          👋 Welcome{" "}
          {user?.name}
        </h2>

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

        {/* STATS */}
        <div className="stats-container">

          <div className="stat-card">
            <h4>
              Available
            </h4>
            <p>
              {
                books.filter(
                  (b) =>
                    b.available
                ).length
              }
            </p>
          </div>

          <div className="stat-card">
            <h4>
              Borrowed
            </h4>
            <p>
              {
                myBorrows.length
              }
            </p>
          </div>

          <div className="stat-card">
            <h4>
              Reserved
            </h4>
            <p>
              {
                reservedBooks.length
              }
            </p>
          </div>

          <div className="stat-card">
            <h4>
              Fine
            </h4>
            <p>
              ₹
              {totalFine}
            </p>
          </div>

        </div>

        {/* CHART */}
        <h3>
          📊 My Analytics
        </h3>

        <div
          className="stat-card"
          style={{
            height:
              "320px",
          }}
        >
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <PieChart>
              <Pie
                data={
                  chartData
                }
                dataKey="value"
                outerRadius={
                  110
                }
                label
              >
                {chartData.map(
                  (
                    entry,
                    index
                  ) => (
                    <Cell
                      key={
                        index
                      }
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

        {/* BOOKS */}
        <h3>
          📚 Books
        </h3>

        <div className="book-grid">
          {filteredBooks.map(
            (book) => (
              <motion.div
                key={
                  book._id
                }
                className="book-card"
                whileHover={{
                  scale:
                    1.03,
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
                  ) =>
                    (e.target.src =
                      "/default.jpg")
                  }
                />

                <h4>
                  {
                    book.title
                  }
                </h4>

                <p>
                  {
                    book.author
                  }
                </p>

                <p>
                  {
                    book.genre
                  }
                </p>

                <p>
                  {book.available
                    ? "🟢 Available"
                    : "🔴 Borrowed"}
                </p>

                {book.available ? (
                  <button
                    className="borrow-btn"
                    onClick={() =>
                      borrowBook(
                        book._id
                      )
                    }
                  >
                    Borrow
                  </button>
                ) : (
                  <button
                    className="reserve-btn"
                    onClick={() =>
                      reserveBook(
                        book._id
                      )
                    }
                  >
                    Reserve
                  </button>
                )}
              </motion.div>
            )
          )}
        </div>

        {/* MY BORROWS */}
        <h3 id="my-borrows">
          📦 My Borrowed
          Books
        </h3>

        <div className="book-grid">
          {myBorrows.length ===
            0 && (
            <p>
              No borrowed
              books
            </p>
          )}

          {myBorrows.map(
            (item) => {
              const isLate =
                new Date() >
                new Date(
                  item.dueDate
                );

              return (
                <div
                  key={
                    item._id
                  }
                  className="book-card"
                >
                  <h4>
                    {
                      item
                        .book
                        ?.title
                    }
                  </h4>

                  <p>
                    {
                      item
                        .book
                        ?.author
                    }
                  </p>

                  <p>
                    Due:{" "}
                    {new Date(
                      item.dueDate
                    ).toDateString()}
                  </p>

                  <p>
                    {isLate
                      ? "⚠ Overdue"
                      : "✅ On Time"}
                  </p>

                  <button
                    className="borrow-btn"
                    onClick={() =>
                      renewBook(
                        item._id
                      )
                    }
                  >
                    Renew
                  </button>

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
                </div>
              );
            }
          )}
        </div>

        {/* RESERVED */}
        <h3>
          📌 Reserved
          Books
        </h3>

        <div className="book-grid">
          {reservedBooks.length ===
            0 ? (
            <p>
              No reserved
              books
            </p>
          ) : (
            reservedBooks.map(
              (
                book
              ) => (
                <div
                  key={
                    book._id
                  }
                  className="book-card"
                >
                  <h4>
                    {
                      book.title
                    }
                  </h4>
                  <p>
                    {
                      book.author
                    }
                  </p>
                  <p>
                    Reserved
                  </p>
                </div>
              )
            )
          )}
        </div>

        {/* HISTORY */}
        <h3 id="history">
          📜 Borrow
          History
        </h3>

        <div className="book-grid">
          {history.map(
            (item) => (
              <div
                key={
                  item._id
                }
                className="book-card"
              >
                <h4>
                  {
                    item
                      .book
                      ?.title
                  }
                </h4>

                <p>
                  {
                    item
                      .book
                      ?.author
                  }
                </p>

                <p>
                  {item.status ===
                  "returned"
                    ? "✅ Returned"
                    : "📚 Borrowed"}
                </p>

                <p>
                  Fine ₹
                  {item.fine ||
                    0}
                </p>
              </div>
            )
          )}
        </div>

        {/* DUES */}
        <h3 id="dues">
          💳 Pending
          Fines
        </h3>

        <div className="book-grid">
          {dues.length ===
            0 ? (
            <p>
              No pending
              fines
            </p>
          ) : (
            dues.map(
              (
                item
              ) => (
                <div
                  key={
                    item._id
                  }
                  className="book-card"
                >
                  <h4>
                    {
                      item
                        .book
                        ?.title
                    }
                  </h4>

                  <p>
                    ₹
                    {
                      item.fine
                    }
                  </p>

                  <button
                    className="borrow-btn"
                    onClick={() =>
                      payFine(
                        item._id
                      )
                    }
                  >
                    Pay Fine
                  </button>
                </div>
              )
            )
          )}
        </div>

      </div>
    </div>
  );
};

export default MemberDashboard;