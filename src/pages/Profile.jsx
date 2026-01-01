import React, { useEffect, useState } from "react";
import { getMyBorrows, returnBook } from "../api/api";

const Profile = () => {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBorrows = async () => {
    try {
      const { data } = await getMyBorrows();
      setBorrows(data);
    } catch (err) {
      setError("Failed to load borrow history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrows();
  }, []);

  const handleReturn = async (borrowId) => {
    try {
      await returnBook(borrowId);
      alert("Book returned successfully");
      fetchBorrows(); // refresh list
    } catch (err) {
      alert("Return failed");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Borrowed Books</h2>

      {borrows.length === 0 ? (
        <p>No borrow records found</p>
      ) : (
        <table border="1" cellPadding="10" cellSpacing="0">
          <thead>
            <tr>
              <th>Book</th>
              <th>Author</th>
              <th>Borrowed Date</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Fine</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {borrows.map((borrow) => (
              <tr key={borrow._id}>
                <td>{borrow.book?.title}</td>
                <td>{borrow.book?.author}</td>
                <td>
                  {new Date(borrow.createdAt).toLocaleDateString()}
                </td>
                <td>
                  {borrow.dueDate
                    ? new Date(borrow.dueDate).toLocaleDateString()
                    : "-"}
                </td>
                <td>
                  {borrow.returned ? (
                    <span style={{ color: "green" }}>Returned</span>
                  ) : (
                    <span style={{ color: "orange" }}>Borrowed</span>
                  )}
                </td>
                <td>₹{borrow.fine || 0}</td>
                <td>
                  {!borrow.returned && (
                    <button
                      onClick={() => handleReturn(borrow._id)}
                      style={{
                        padding: "5px 10px",
                        cursor: "pointer",
                      }}
                    >
                      Return
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Profile;
