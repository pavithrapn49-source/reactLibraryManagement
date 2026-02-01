import React, { useEffect, useState } from "react";
import { getMyBorrows, returnBook } from "../api/borrowApi";

import "../styles/profile.css";

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
      fetchBorrows();
    } catch (err) {
      alert("Return failed");
    }
  };

  if (loading) return <p className="info-text">Loading...</p>;
  if (error) return <p className="info-text" style={{ color: "red" }}>{error}</p>;

  return (
    <div className="profile-page">
      <h2 className="profile-title">My Borrowed Books</h2>

      {borrows.length === 0 ? (
        <p className="info-text">No borrow records found</p>
      ) : (
        <div className="table-container">
          <table className="borrow-table">
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
                  <td>{new Date(borrow.createdAt).toLocaleDateString()}</td>
                  <td>
                    {borrow.dueDate
                      ? new Date(borrow.dueDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>
                    {borrow.returned ? (
                      <span className="status-returned">Returned</span>
                    ) : (
                      <span className="status-borrowed">Borrowed</span>
                    )}
                  </td>
                  <td>₹{borrow.fine || 0}</td>
                  <td>
                    {!borrow.returned && (
                      <button
                        className="return-btn"
                        onClick={() => handleReturn(borrow._id)}
                      >
                        Return
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Profile;
