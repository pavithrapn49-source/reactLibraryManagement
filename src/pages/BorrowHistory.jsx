
import { useEffect, useState } from "react";
import axios from "../api/axios";

const BorrowHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    axios.get("/borrow/history").then((res) => {
      setHistory(res.data);
    });
  }, []);

  return (
    <div>
      <h2>📜 Borrow History</h2>

      {history.map((b) => (
        <div key={b._id} className="book-card">
          <h3>{b.book?.title}</h3>
          <p>Status: {b.returned ? "Returned" : "Active"}</p>
        </div>
      ))}
    </div>
  );
};

export default BorrowHistory;