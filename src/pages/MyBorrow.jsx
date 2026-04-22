import { useEffect, useState } from "react";
import { getMyBorrows, returnBook } from "../api/borrowApi";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const MyBorrow = () => {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ================= */
  const fetchBorrows = async () => {
    try {
      const data = await getMyBorrows();
      setBorrows(data || []);
    } catch (error) {
      toast.error(error.message || "Failed to fetch borrowed books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrows();
  }, []);

  /* ================= FINE ================= */
  const calculateFine = (dueDate) => {
    if (!dueDate) return 0;

    const today = new Date();
    const due = new Date(dueDate);

    if (today <= due) return 0;

    const lateDays = Math.ceil(
      (today - due) / (1000 * 60 * 60 * 24)
    );

    return lateDays * 10;
  };

  /* ================= RETURN ================= */
  const handleReturn = async (id) => {
    try {
      await returnBook(id);
      toast.success("Book returned successfully");
      fetchBorrows();
    } catch (error) {
      toast.error(error.message || "Return failed");
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <h2>Loading borrowed books...</h2>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h2 className="text-2xl font-bold mb-6">
        📚 My Borrowed Books
      </h2>

      {borrows.length === 0 ? (
        <p>No borrowed books 📭</p>
      ) : (
        <div className="book-grid">
          {borrows.map((item) => {
            const dueDate = new Date(item.dueDate);
            const today = new Date();

            const daysLeft = Math.ceil(
              (dueDate - today) / (1000 * 60 * 60 * 24)
            );

            const fine = calculateFine(item.dueDate);

            return (
              <motion.div
                key={item._id}
                className="book-card"
                whileHover={{ scale: 1.03 }}
              >
                <h3>{item.book?.title || "Unknown Book"}</h3>
                <p>{item.book?.author}</p>

                <p>
                  Due Date: {dueDate.toDateString()}
                </p>

                {fine > 0 ? (
                  <>
                    <p style={{ color: "red" }}>
                      Overdue by {Math.abs(daysLeft)} days
                    </p>
                    <p style={{ color: "orange" }}>
                      Fine: ₹{fine}
                    </p>
                  </>
                ) : (
                  <p style={{ color: "green" }}>
                    {daysLeft} days left
                  </p>
                )}

                <button
                  className="return-btn"
                  onClick={() => handleReturn(item._id)}
                >
                  Return Book
                </button>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBorrow;