import { useState, useEffect } from "react";

import "../styles/memberDashboard.css";

import { useAuth } from "../context/AuthContext";

import { toast } from "react-toastify";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  getBooks,
  getReservedForMe,
} from "../api/bookApi";

import {
  getMyBorrows,
  getMyHistory,
  getMyReservedBooks,
  getMyReturnedBooks,
} from "../api/borrowApi";

const COLORS = [
  "#22c55e",
  "#ef4444",
  "#3b82f6",
];

const MemberDashboard = () => {
  const { user } = useAuth();

  const [books, setBooks] =
    useState([]);

  const [myBorrows, setMyBorrows] =
    useState([]);

  const [history, setHistory] =
    useState([]);

  const [
    reservedBooks,
    setReservedBooks,
  ] = useState([]);

  const [
    returnedBooks,
    setReturnedBooks,
  ] = useState([]);

  const [
    reservedForMe,
    setReservedForMe,
  ] = useState([]);

  const [loading, setLoading] =
    useState(true);

  /* ================= FETCH ================= */

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const [
        booksRes,
        borrowsRes,
        historyRes,
        reservedRes,
        returnedRes,
      ] = await Promise.all([
        getBooks(),
        getMyBorrows(),
        getMyHistory(),
        getMyReservedBooks(),
        getMyReturnedBooks(),
      ]);

      setBooks(
        booksRes?.books || []
      );

      setMyBorrows(
        borrowsRes || []
      );

      setHistory(
        historyRes || []
      );

      setReservedBooks(
        reservedRes || []
      );

      setReturnedBooks(
        returnedRes || []
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= RESERVED FOR ME ================= */

  const fetchReservedForMe =
    async () => {
      try {
        const res =
          await getReservedForMe();

        setReservedForMe(
          res.books || []
        );
      } catch (error) {
        console.error(error);
      }
    };

  /* ================= LOAD ================= */

  useEffect(() => {
    if (user?.token) {
      loadDashboard();

      fetchReservedForMe();
    }
  }, [user]);

  /* ================= CHART ================= */

  const chartData = [
    {
      name: "Borrowed",
      value: myBorrows.length,
    },

    {
      name: "Returned",
      value: returnedBooks.length,
    },

    {
      name: "Reserved",
      value:
        reservedBooks.length,
    },
  ];

  /* ================= FINE ================= */

  const totalFine =
    history.reduce(
      (sum, item) =>
        sum + (item.fine || 0),
      0
    );

  /* ================= RECENT ACTIVITY ================= */

  const recentActivities = [
    ...myBorrows.map((b) => ({
      type: "borrow",
      text: `Borrowed ${b.book?.title}`,
      date: b.borrowDate,
    })),

    ...reservedBooks.map(
      (r) => ({
        type: "reserve",
        text: `Reserved ${
          r.book?.title || ""
        }`,
        date: r.createdAt,
      })
    ),

    ...returnedBooks.map(
      (r) => ({
        type: "return",
        text: `Returned ${
          r.book?.title || ""
        }`,
        date: r.returnDate,
      })
    ),
  ]
    .sort(
      (a, b) =>
        new Date(b.date) -
        new Date(a.date)
    )
    .slice(0, 8);

  /* ================= NOTIFICATIONS ================= */

  const notifications = [];

  reservedForMe.forEach(
    (book) => {
      notifications.push({
        type: "reserved",
        text: `${book.title} is ready for borrowing`,
      });
    }
  );

  myBorrows.forEach(
    (borrow) => {
      const dueDate =
        new Date(
          borrow.dueDate
        );

      const today =
        new Date();

      const diff =
        Math.ceil(
          (dueDate - today) /
            (1000 *
              60 *
              60 *
              24)
        );

      if (
        diff <= 2 &&
        diff >= 0
      ) {
        notifications.push({
          type: "warning",
          text: `${borrow.book?.title} is due in ${diff} day(s)`,
        });
      }

      if (diff < 0) {
        notifications.push({
          type: "overdue",
          text: `${borrow.book?.title} is overdue`,
        });
      }
    }
  );

  if (totalFine > 0) {
    notifications.push({
      type: "fine",
      text: `Pending fine ₹${totalFine}`,
    });
  }

  /* ================= RECOMMENDATIONS ================= */

  const recommendedBooks =
    books
      .filter((book) => {
        const alreadyBorrowed =
          history.some(
            (h) =>
              h.book?._id ===
              book._id
          );

        if (alreadyBorrowed)
          return false;

        const sameGenre =
          history.some(
            (h) =>
              h.book?.genre ===
              book.genre
          );

        const sameAuthor =
          history.some(
            (h) =>
              h.book?.author ===
              book.author
          );

        return (
          sameGenre ||
          sameAuthor
        );
      })
      .slice(0, 4);

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
    <div className="dashboard-container">

      {/* ================= HEADER ================= */}

      <h2 className="dashboard-title">
        👋 Welcome {user?.name}
      </h2>

      {/* ================= STATS ================= */}

      <div className="stats-container">

        <div className="stat-card">
          <h4>
            Available Books
          </h4>

          <p>
            {
              books.filter(
                (b) =>
                  b.status ===
                  "available"
              ).length
            }
          </p>
        </div>

        <div className="stat-card">
          <h4>Borrowed</h4>

          <p>
            {myBorrows.length}
          </p>
        </div>

        <div className="stat-card">
          <h4>Reserved</h4>

          <p>
            {
              reservedBooks.length
            }
          </p>
        </div>

        <div className="stat-card">
          <h4>Total Fine</h4>

          <p>
            ₹{totalFine}
          </p>
        </div>

      </div>

      {/* ================= NOTIFICATIONS ================= */}

      <div className="notification-section">

        <h3>
          🔔 Notifications
        </h3>

        {notifications.length ===
        0 ? (
          <p className="empty-text">
            No notifications
          </p>
        ) : (
          <div className="notification-list">

            {notifications.map(
              (
                note,
                index
              ) => (
                <div
                  key={index}
                  className={`notification-card ${note.type}`}
                >

                  <span className="notification-icon">

                    {note.type ===
                      "reserved" &&
                      "📚"}

                    {note.type ===
                      "warning" &&
                      "⏳"}

                    {note.type ===
                      "overdue" &&
                      "⚠"}

                    {note.type ===
                      "fine" &&
                      "💰"}

                  </span>

                  <p>
                    {note.text}
                  </p>

                </div>
              )
            )}

          </div>
        )}
      </div>

      {/* ================= CHART ================= */}

      <div className="chart-section">

        <h3>
          📊 My Analytics
        </h3>

        <div
          style={{
            width: "100%",
            height: 320,
          }}
        >

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

                {chartData.map(
                  (
                    entry,
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

      {/* ================= RESERVED FOR YOU ================= */}

      <div className="reserved-section">

        <h3>
          📚 Reserved For You
        </h3>

        {reservedForMe.length ===
        0 ? (
          <p className="empty-text">
            No reserved books
          </p>
        ) : (
          <div className="reserved-grid">

            {reservedForMe.map(
              (book) => (
                <div
                  key={book._id}
                  className="reserved-card"
                >

                  <h4>
                    {book.title}
                  </h4>

                  <p>
                    {book.author}
                  </p>

                  <span>
                    Ready for borrowing
                  </span>

                </div>
              )
            )}

          </div>
        )}
      </div>

      {/* ================= TIMELINE ================= */}

      <div className="timeline-section">

        <h3>
          🕒 Recent Activity
        </h3>

        {recentActivities.length ===
        0 ? (
          <p className="empty-text">
            No recent activity
          </p>
        ) : (
          <div className="timeline-list">

            {recentActivities.map(
              (
                item,
                index
              ) => (
                <div
                  key={index}
                  className="timeline-item"
                >

                  <div className="timeline-icon">

                    {item.type ===
                      "borrow" &&
                      "📚"}

                    {item.type ===
                      "reserve" &&
                      "🟡"}

                    {item.type ===
                      "return" &&
                      "↩"}

                  </div>

                  <div>

                    <p className="timeline-text">
                      {item.text}
                    </p>

                    <span className="timeline-date">
                      {new Date(
                        item.date
                      ).toLocaleDateString()}
                    </span>

                  </div>

                </div>
              )
            )}

          </div>
        )}
      </div>

      {/* ================= RECOMMENDED BOOKS ================= */}

      <div className="recommend-section">

        <h3>
          ⭐ Recommended Books
        </h3>

        {recommendedBooks.length ===
        0 ? (
          <p className="empty-text">
            No recommendations yet
          </p>
        ) : (
          <div className="recommend-grid">

            {recommendedBooks.map(
              (book) => (
                <div
                  key={book._id}
                  className="recommend-card"
                >

                  <h4>
                    {book.title}
                  </h4>

                  <p>
                    {book.author}
                  </p>

                  <span>
                    {book.genre}
                  </span>

                </div>
              )
            )}

          </div>
        )}
      </div>

      {/* ================= RECENT BORROWS ================= */}

      <div className="recent-section">

        <h3>
          📚 Recent Borrowed Books
        </h3>

        {myBorrows.length ===
        0 ? (
          <p>
            No borrowed books
          </p>
        ) : (
          <div className="borrow-list">

            {myBorrows
              .slice(0, 5)
              .map((item) => (
                <div
                  key={item._id}
                  className="borrow-item"
                >

                  <h4>
                    {
                      item.book
                        ?.title
                    }
                  </h4>

                  <p>
                    {
                      item.book
                        ?.author
                    }
                  </p>

                  <span>
                    Borrowed
                  </span>

                </div>
              ))}

          </div>
        )}
      </div>

    </div>
  );
};

export default MemberDashboard;