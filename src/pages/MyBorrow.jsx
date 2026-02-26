import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/SideBar.jsx";

export default function MyBorrow() {
  const [borrows, setBorrows] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchBorrows();
  }, []);

  const fetchBorrows = async () => {
    const res = await axios.get("http://localhost:5000/api/borrow/my", {
      headers: { authorization: token }
    });
    setBorrows(res.data);
  };

  const returnBook = async (id) => {
    await axios.put(`http://localhost:5000/api/borrow/return/${id}`,
      {},
      { headers: { authorization: token } }
    );
    fetchBorrows();
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ padding: "20px" }}>
        <h2>My Borrowed Books</h2>

        <ul>
          {borrows.map(b => (
            <li key={b._id}>
              {b.book.title} - {b.status}
              {b.status === "issued" &&
                <button onClick={() => returnBook(b._id)}>Return</button>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}