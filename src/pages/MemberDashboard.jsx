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

import { getBooks, getReservedForMe } from "../api/bookApi";

import {
  getMyBorrows,
  getMyHistory,
  getMyReservedBooks,
  getMyReturnedBooks,
} from "../api/borrowApi";

const COLORS = ["#22c55e", "#ef4444", "#3b82f6"];

const MemberDashboard = () => {
  const { user } = useAuth();

  const [books, setBooks] = useState([]);
  const [myBorrows, setMyBorrows] = useState([]);
  const [history, setHistory] = useState([]);
  const [reservedBooks, setReservedBooks] = useState([]);
  const [returnedBooks, setReturnedBooks] = useState([]);
  const [reservedForMe, setReservedForMe] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= SAFE EXTRACTOR ================= */
  const getArray = (res) => {
    return (
      res?.data?.records ||
      res?.records ||
      res?.data?.books ||
      res?.books ||
      []
    );
  };

  const getBooksArray = (res) => {
    return res?.data?.books || res?.books || [];
  };

  /* ================= LOAD DASHBOARD ================= */
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

      console.log("BOOKS:", booksRes);
      console.log("BORROWS:", borrowsRes);
      console.log("HISTORY:", historyRes);
      console.log("RESERVED:", reservedRes);
      console.log("RETURNED:", returnedRes);

      /* ================= FIXED DATA MAPPING ================= */

      setBooks(getBooksArray(booksRes));
      setMyBorrows(getArray(borrowsRes));
      setHistory(getArray(historyRes));
      setReservedBooks(getArray(reservedRes));
      setReturnedBooks(getArray(returnedRes));

    } catch (error) {
      console.error(error);
      toast.error("Failed to load dashboard");

      setBooks([]);
      setMyBorrows([]);
      setHistory([]);
      setReservedBooks([]);
      setReturnedBooks([]);

    } finally {
      setLoading(false);
    }
  };

  /* ================= RESERVED FOR ME ================= */
  const fetchReservedForMe = async () => {
    try {
      const res = await getReservedForMe();
      setReservedForMe(res?.data?.books || res?.books || []);
    } catch (error) {
      console.error(error);
      setReservedForMe([]);
    }
  };

  /* ================= INIT ================= */
  useEffect(() => {
    if (user?._id) {
      loadDashboard();
      fetchReservedForMe();
    }
  }, [user]);

  /* ================= SAFE FINE CALC ================= */
  const totalFine = Array.isArray(history)
    ? history.reduce((sum, item) => sum + (item?.fine || 0), 0)
    : 0;

  /* ================= CHART DATA ================= */
  const chartData = [
    { name: "Borrowed", value: myBorrows?.length || 0 },
    { name: "Returned", value: returnedBooks?.length || 0 },
    { name: "Reserved", value: reservedBooks?.length || 0 },
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
    <div className="dashboard-container">

      {/* ================= HEADER ================= */}
      <h2 className="dashboard-title">
        👋 Welcome {user?.name}
      </h2>

      {/* ================= STATS ================= */}
      <div className="stats-container">

        <div className="stat-card">
          <h4>Total Books</h4>
          <p>{books.length}</p>
        </div>

        <div className="stat-card">
          <h4>Borrowed</h4>
          <p>{myBorrows.length}</p>
        </div>

        <div className="stat-card">
          <h4>Reserved</h4>
          <p>{reservedBooks.length}</p>
        </div>

        <div className="stat-card">
          <h4>Returned</h4>
          <p>{returnedBooks.length}</p>
        </div>

        <div className="stat-card">
          <h4>Total Fine</h4>
          <p>₹{totalFine}</p>
        </div>

      </div>

      {/* ================= CHART ================= */}
      <div className="chart-section">
        <h3>📊 My Analytics</h3>

        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie data={chartData} dataKey="value" outerRadius={110} label>
              {chartData.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* ================= BORROWED ================= */}
      <div className="recent-section">
        <h3>📚 Borrowed Books</h3>

        {myBorrows.length === 0 ? (
          <p>No borrowed books</p>
        ) : (
          <div className="borrow-list">
            {myBorrows.map((item) => (
              <div key={item._id} className="borrow-item">
                <h4>{item.book?.title}</h4>
                <p>{item.book?.author}</p>
                <span>Borrowed</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= RESERVED ================= */}
      <div className="recent-section">
        <h3>📚 Reserved Books</h3>

        {reservedBooks.length === 0 ? (
          <p>No reserved books</p>
        ) : (
          <div className="borrow-list">
            {reservedBooks.map((item) => (
              <div key={item._id} className="borrow-item">
                <h4>{item.book?.title}</h4>
                <p>{item.book?.author}</p>
                <span>Reserved</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= RETURNED ================= */}
      <div className="recent-section">
        <h3>↩ Returned Books</h3>

        {returnedBooks.length === 0 ? (
          <p>No returned books</p>
        ) : (
          <div className="borrow-list">
            {returnedBooks.map((item) => (
              <div key={item._id} className="borrow-item">
                <h4>{item.book?.title}</h4>
                <p>{item.book?.author}</p>
                <span>Returned</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= HISTORY ================= */}
      <div className="recent-section">
        <h3>🕒 Borrow History</h3>

        {history.length === 0 ? (
          <p>No history found</p>
        ) : (
          <div className="borrow-list">
            {history.map((item) => (
              <div key={item._id} className="borrow-item">
                <h4>{item.book?.title}</h4>
                <p>Status: {item.status}</p>
                <p>Fine: ₹{item.fine || 0}</p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default MemberDashboard;