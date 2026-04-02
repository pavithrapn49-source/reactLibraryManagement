import { useEffect, useState } from "react";
import axios from "../api/axios";

const PayFine = () => {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 Fetch borrowed books
  const fetchBorrows = async () => {
    try {
      const res = await axios.get("/borrow/my-borrows");
      setBorrows(res.data);
    } catch (error) {
      alert("Error fetching borrows");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrows();
  }, []);

  // 🔥 Calculate fine (₹10 per day)
  const calculateFine = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);

    const diffTime = today - due;
    const daysLate = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return daysLate > 0 ? daysLate * 10 : 0;
  };

  // 🔥 Handle payment
  const handlePay = async (borrowId) => {
    try {
      // You can connect real backend later
      alert("✅ Payment successful");

      // Optional: mark returned after payment
      await axios.put(`/borrow/return/${borrowId}`);

      fetchBorrows();
    } catch (error) {
      alert("Payment failed");
    }
  };

  if (loading) return <h2>Loading fines...</h2>;

  return (
    <div className="p-4">
      <h2 style={{ marginBottom: "20px" }}>💰 Pay Fine</h2>

      {borrows.length === 0 ? (
        <p>No borrowed books</p>
      ) : (
        <div className="fine-grid">
          {borrows.map((b) => {
            const fine = calculateFine(b.dueDate);
            const isLate = fine > 0;

            return (
              <div key={b._id} className="fine-card">
                <h3>{b.book?.title}</h3>
                <p>Author: {b.book?.author}</p>

                <p>
                  Due Date:{" "}
                  {new Date(b.dueDate).toDateString()}
                </p>

                {isLate ? (
                  <>
                    <p style={{ color: "red", fontWeight: "bold" }}>
                      ⚠ Overdue
                    </p>
                    <p style={{ fontSize: "18px" }}>
                      Fine: ₹{fine}
                    </p>

                    <button
                      className="pay-btn"
                      onClick={() => handlePay(b._id)}
                    >
                      Pay Now
                    </button>
                  </>
                ) : (
                  <p style={{ color: "green" }}>
                    ✅ No Fine
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PayFine;