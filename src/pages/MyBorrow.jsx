import { useEffect, useState } from "react";
import axios from "../api/axios";

const MyBorrow = () => {
  const [borrows, setBorrows] = useState([]);
const fetchBorrows = async () => {
  const res = await axios.get("/borrow/my-borrows"); // ✅ FIX
  setBorrows(res.data);
};

  useEffect(() => {
    fetchBorrows();
  }, []);

  const handleReturn = async (id) => {
    await axios.put(`/borrow/return/${id}`);
    alert("Returned!");
    fetchBorrows();
  };

  return (
    <div>
      <h2>📖 My Borrowed Books</h2>

      {borrows.map((b) => {
        const isLate = new Date(b.dueDate) < new Date();

        return (
          <div key={b._id} className="borrow-card">
            <h3>{b.book.title}</h3>
            <p>Due: {new Date(b.dueDate).toDateString()}</p>

            {isLate && <p style={{ color: "red" }}>⚠ Overdue</p>}

            <button onClick={() => handleReturn(b._id)}>
              Return
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default MyBorrow;