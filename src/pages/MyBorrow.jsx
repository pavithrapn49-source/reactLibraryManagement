import { useEffect, useState } from "react";
import axios from "../api/axios";
import { motion } from "framer-motion";

const MyBorrow = () => {
  const [borrows, setBorrows] = useState([]);

  const fetchBorrows = async () => {
    try {
      const res = await axios.get("/borrow/my-borrows");
      setBorrows(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchBorrows();
  }, []);

  // 💰 Fine calculation (₹10 per day)
  const calculateFine = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);

    if (today <= due) return 0;

    const diffDays = Math.ceil((today - due) / (1000 * 60 * 60 * 24));
    return diffDays * 10;
  };

  // 🔁 Return
  const handleReturn = async (id) => {
    try {
      await axios.put(`/borrow/return/${id}`);
      alert("Book returned!");
      fetchBorrows();
    } catch (err) {
      alert("Error returning book");
    }
  };

  return (
    <div className="dashboard-container">
      <h2>📖 My Borrowed Books</h2>

      {/* 📭 EMPTY */}
      {borrows.length === 0 && (
        <p style={{ marginTop: "20px" }}>No borrowed books 📭</p>
      )}

      {/* 📚 GRID */}
      <div className="book-grid">
        {borrows.map((b) => {
          const due = new Date(b.dueDate);
          const today = new Date();

          const isLate = today > due;
          const fine = calculateFine(b.dueDate);

          const daysLeft = Math.ceil(
            (due - today) / (1000 * 60 * 60 * 24)
          );

          return (
            <motion.div
              key={b._id}
              className="book-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
            >
              <h3>{b.book?.title}</h3>
              <p>{b.book?.author}</p>

              <p>
                📅 Due: {due.toDateString()}
              </p>

              {/* ⏳ STATUS */}
              {!isLate ? (
                <p style={{ color: "green" }}>
                  ⏳ {daysLeft} days left
                </p>
              ) : (
                <p style={{ color: "red" }}>
                  ⚠ Overdue by {Math.abs(daysLeft)} days
                </p>
              )}

              {/* 💰 FINE */}
              {fine > 0 && (
                <p style={{ color: "orange", fontWeight: "bold" }}>
                  💰 Fine: ₹{fine}
                </p>
              )}

              {/* 🔘 RETURN */}
              <button
                className="return-btn"
                onClick={() => handleReturn(b._id)}
              >
                Return Book
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default MyBorrow;