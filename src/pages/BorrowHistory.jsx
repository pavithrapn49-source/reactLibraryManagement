import { useEffect, useState } from "react";
import { getHistory } from "../api/borrow"; // ✅ use borrow API helper
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const BorrowHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getHistory();
        setHistory(data);
      } catch (err) {
        toast.error(err.message || "Failed to fetch borrow history");
      }
    };
    fetchHistory();
  }, []);

  if (!history || history.length === 0) {
    return <p className="text-gray-500">No borrow history found 📭</p>;
  }

  return (
    <div className="dashboard-container">
      <h2 className="text-2xl font-bold mb-4">📜 Borrow History</h2>

      <div className="space-y-3">
        {history.map((b) => (
          <motion.div
            key={b._id}
            className="book-card border rounded-md p-3 shadow-sm hover:shadow-md transition"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
          >
            <h3 className="font-semibold">{b.book?.title}</h3>
            <p className="text-sm text-gray-600">Author: {b.book?.author}</p>
            <p
              className={`text-sm ${
                b.returned ? "text-blue-600" : "text-green-600"
              }`}
            >
              Status: {b.returned ? "Returned" : "Active"}
            </p>
            <p className="text-xs text-gray-500">
              Borrowed on: {new Date(b.borrowDate).toLocaleDateString()}
            </p>
            {b.returnDate && (
              <p className="text-xs text-gray-500">
                Returned on: {new Date(b.returnDate).toLocaleDateString()}
              </p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BorrowHistory;
