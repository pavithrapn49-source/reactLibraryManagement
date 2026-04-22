import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import "../styles/payFine.css";

const PayFine = () => {
  const { user } = useAuth();

  const [dues, setDues] = useState([]);
  const [loading, setLoading] = useState(true);

  const authHeaders = () => ({
    headers: {
      Authorization: `Bearer ${user?.token}`,
    },
  });

  /* ================= FETCH DUES ================= */
  const fetchDues = async () => {
    try {
      const res = await axios.get(
        "/transactions/dues",
        authHeaders()
      );

      setDues(res.data);
    } catch (error) {
      toast.error("Failed to fetch dues");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchDues();
    }
  }, [user]);

  /* ================= PAY FINE ================= */
  const handlePay = async (id) => {
    try {
      await axios.post(
        `/transactions/pay-fine/${id}`,
        {},
        authHeaders()
      );

      toast.success("Fine paid successfully");
      fetchDues();
    } catch (error) {
      toast.error("Payment failed");
    }
  };

  const totalFine = dues.reduce(
    (sum, item) => sum + item.fine,
    0
  );

  if (loading) {
    return (
      <div className="fine-container">
        <h2>Loading fines...</h2>
      </div>
    );
  }

  return (
    <div className="fine-container">
      <h2 className="fine-title">
        💳 Pay Library Fine
      </h2>

      <div className="fine-summary">
        Total Pending Fine: ₹{totalFine}
      </div>

      {dues.length === 0 ? (
        <div className="no-fine">
          🎉 No unpaid fines
        </div>
      ) : (
        <div className="fine-grid">
          {dues.map((item) => (
            <motion.div
              key={item._id}
              className="fine-card"
              whileHover={{
                scale: 1.03,
              }}
            >
              <h3>
                {item.book?.title}
              </h3>

              <p>
                {item.book?.author}
              </p>

              <p>
                Fine:
                <strong>
                  ₹{item.fine}
                </strong>
              </p>

              <button
                onClick={() =>
                  handlePay(item._id)
                }
              >
                Pay Now
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PayFine;