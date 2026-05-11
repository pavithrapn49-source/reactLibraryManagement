import { useEffect, useState } from "react";
import { getHistory } from "../api/borrowApi";

const History = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const data = await getHistory();
    setHistory(data);
  };

  return (
    <div className="dashboard-container">
      <h2>📜 History Timeline</h2>

      {history.map((item) => (
        <div className="timeline-card" key={item._id}>
          <h3>{item.book?.title}</h3>

          <p>📌 Reserved: {new Date(item.reservedAt).toLocaleDateString()}</p>

          {item.borrowedAt && (
            <p>📚 Borrowed: {new Date(item.borrowedAt).toLocaleDateString()}</p>
          )}

          {item.dueDate && (
            <p>⏳ Due: {new Date(item.dueDate).toLocaleDateString()}</p>
          )}

          {item.returnedAt && (
            <p>✅ Returned: {new Date(item.returnedAt).toLocaleDateString()}</p>
          )}

          {item.fine > 0 && (
            <p style={{ color: "red" }}>
              💰 Fine: ₹{item.fine}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default History;