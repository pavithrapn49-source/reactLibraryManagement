import { useEffect, useState } from "react";
import {
  getMyReservedBooks,
  getMyBorrows,
  getMyReturnedBooks,
  borrowBook,
  returnBook,
} from "../api/borrowApi";

import { toast } from "react-toastify";
import { motion } from "framer-motion";

/* ================= IMAGE MAP ================= */
const bookImages = {
  "React Guide": "/react guide.jpg",
  "Geographical Tales": "/geo tales.jpg",
  "Harry Potter": "/harry potter.jpg",
  "Java Guide": "/java.jpg",
  "Children's Tales": "/childrens tales.jpg",
  "Lessons of Maths": "/maths.jpg",
  "Little Ones": "/little ones.jpg",
};

/* ================= IMAGE HELPER ================= */
const getBookImage = (title) => {
  const key = Object.keys(bookImages).find(
    (k) =>
      k.toLowerCase() ===
      (title || "").trim().toLowerCase()
  );

  return key
    ? bookImages[key]
    : "/default.jpg";
};

const MyBorrow = () => {
  const [reserved, setReserved] =
    useState([]);

  const [borrows, setBorrows] =
    useState([]);

  const [returned, setReturned] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [loadingId, setLoadingId] =
    useState(null);

  /* ================= FETCH DATA ================= */
  const fetchData = async () => {
    try {
      setLoading(true);

      const reservedData =
        await getMyReservedBooks();

      const borrowedData =
        await getMyBorrows();

      const returnedData =
        await getMyReturnedBooks();

      setReserved(
        reservedData?.records ||
          reservedData ||
          []
      );

      setBorrows(
        borrowedData?.records ||
          borrowedData ||
          []
      );

      setReturned(
        returnedData?.records ||
          returnedData ||
          []
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to fetch data"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    fetchData();
  }, []);

  /* ================= BORROW ================= */
  const handleBorrow = async (
    bookId
  ) => {
    try {
      setLoadingId(bookId);

      await borrowBook(bookId);

      toast.success(
        "Book borrowed successfully"
      );

      await fetchData();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Borrow failed"
      );
    } finally {
      setLoadingId(null);
    }
  };

  /* ================= RETURN ================= */
  const handleReturn = async (
    borrowId
  ) => {
    try {
      setLoadingId(borrowId);

      const res = await returnBook(
        borrowId
      );

      if (res?.fine > 0) {
        toast.success(
          `Book returned. Fine: ₹${res.fine}`
        );
      } else {
        toast.success(
          "Book returned successfully"
        );
      }

      await fetchData();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Return failed"
      );
    } finally {
      setLoadingId(null);
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="dashboard-container">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h2 className="text-3xl font-bold mb-6">
        📚 My Library
      </h2>

      {/* ================= RESERVED ================= */}
      <h3 className="text-2xl font-semibold mb-4">
        🟡 Reserved Books
      </h3>

      {reserved.length === 0 ? (
        <p className="no-data">
          No reserved books 📭
        </p>
      ) : (
        <div className="book-grid">
          {reserved.map((item) => (
            <motion.div
              key={item._id}
              className="book-card"
              whileHover={{
                scale: 1.03,
              }}
            >
              <img
                src={getBookImage(
                  item.book?.title
                )}
                alt={item.book?.title}
                className="book-image"
                onError={(e) =>
                  (e.target.src =
                    "/default.jpg")
                }
              />

              <h3>
                {item.book?.title}
              </h3>

              <p>
                {item.book?.author}
              </p>

              <p
                style={{
                  color: "#eab308",
                  fontWeight: "bold",
                }}
              >
                Reserved
              </p>

              <button
                disabled={
                  loadingId ===
                  item.book?._id
                }
                onClick={() =>
                  handleBorrow(
                    item.book?._id
                  )
                }
              >
                {loadingId ===
                item.book?._id
                  ? "Loading..."
                  : "Borrow"}
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* ================= BORROWED ================= */}
      <h3 className="text-2xl font-semibold mt-10 mb-4">
        🔴 Borrowed Books
      </h3>

      {borrows.length === 0 ? (
        <p className="no-data">
          No borrowed books 📭
        </p>
      ) : (
        <div className="book-grid">
          {borrows.map((item) => (
            <motion.div
              key={item._id}
              className="book-card"
              whileHover={{
                scale: 1.03,
              }}
            >
              <img
                src={getBookImage(
                  item.book?.title
                )}
                alt={item.book?.title}
                className="book-image"
                onError={(e) =>
                  (e.target.src =
                    "/default.jpg")
                }
              />

              <h3>
                {item.book?.title}
              </h3>

              <p>
                {item.book?.author}
              </p>

              <p
                style={{
                  color: "red",
                  fontWeight: "bold",
                }}
              >
                Borrowed
              </p>

              {/* DUE DATE */}
              <p>
                Due Date:{" "}
                {item.dueDate
                  ? new Date(
                      item.dueDate
                    ).toLocaleDateString()
                  : "N/A"}
              </p>

              {/* FINE */}
              {item.fine > 0 && (
                <p
                  style={{
                    color: "red",
                    fontWeight: "bold",
                  }}
                >
                  Fine: ₹{item.fine}
                </p>
              )}

              <button
                className="return-btn"
                disabled={
                  loadingId === item._id
                }
                onClick={() =>
                  handleReturn(item._id)
                }
              >
                {loadingId === item._id
                  ? "Loading..."
                  : "Return"}
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* ================= RETURNED ================= */}
      <h3 className="text-2xl font-semibold mt-10 mb-4">
        ✅ Returned Books
      </h3>

      {returned.length === 0 ? (
        <p className="no-data">
          No returned books 📭
        </p>
      ) : (
        <div className="book-grid">
          {returned.map((item) => (
            <motion.div
              key={item._id}
              className="book-card"
              whileHover={{
                scale: 1.03,
              }}
            >
              <img
                src={getBookImage(
                  item.book?.title
                )}
                alt={item.book?.title}
                className="book-image"
                onError={(e) =>
                  (e.target.src =
                    "/default.jpg")
                }
              />

              <h3>
                {item.book?.title}
              </h3>

              <p>
                {item.book?.author}
              </p>

              <p
                style={{
                  color: "green",
                  fontWeight: "bold",
                }}
              >
                Returned
              </p>

              {/* RETURN DATE */}
              <p>
                Returned On:{" "}
                {item.returnDate
                  ? new Date(
                      item.returnDate
                    ).toLocaleDateString()
                  : "N/A"}
              </p>

              {/* FINAL FINE */}
              {item.fine > 0 && (
                <p
                  style={{
                    color: "red",
                    fontWeight: "bold",
                  }}
                >
                  Fine Paid: ₹{item.fine}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBorrow;