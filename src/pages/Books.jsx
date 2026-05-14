import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";

import { useAuth } from "../context/AuthContext";

import {
  getBooks,
  joinQueue,
  addReview,
} from "../api/bookApi";

import {
  borrowBook,
  getMyReservedBooks,
  getMyBorrows,
} from "../api/borrowApi";

import { toast } from "react-toastify";

import "../styles/books.css";

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

const Books = () => {
  const { user } = useAuth();

  const [books, setBooks] = useState([]);

  const [reservedBooks, setReservedBooks] =
    useState([]);

  const [borrowedBooks, setBorrowedBooks] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState("all");

  const [sort, setSort] =
    useState("none");

  const [loadingId, setLoadingId] =
    useState(null);

  /* REVIEW */

  const [selectedBook, setSelectedBook] =
    useState(null);

  const [rating, setRating] =
    useState(5);

  const [comment, setComment] =
    useState("");

  /* ================= FETCH BOOKS ================= */

  const fetchBooks = async () => {
    try {
      const res = await getBooks();

      const booksData =
        res?.books || [];

      setBooks(
        Array.isArray(booksData)
          ? booksData
          : []
      );
    } catch (err) {
      console.log(err);

      toast.error(
        err.response?.data?.message ||
          "Failed to fetch books"
      );
    }
  };

  /* ================= FETCH RESERVED ================= */

  const fetchReserved = async () => {
    try {
      const res =
        await getMyReservedBooks();

      const reservedIds =
        Array.isArray(res?.records)
          ? res.records.map((r) =>
              String(r.book?._id)
            )
          : [];

      setReservedBooks(reservedIds);
    } catch (err) {
      console.log(err);

      setReservedBooks([]);
    }
  };

  /* ================= FETCH BORROWED ================= */

  const fetchBorrowed = async () => {
    try {
      const res =
        await getMyBorrows();

      const borrowedIds =
        Array.isArray(res?.records)
          ? res.records.map((b) =>
              String(b.book?._id)
            )
          : [];

      setBorrowedBooks(borrowedIds);
    } catch (err) {
      console.log(err);

      setBorrowedBooks([]);
    }
  };

  /* ================= LOAD ALL ================= */

  const loadAllData = async () => {
    await fetchBooks();

    await fetchReserved();

    await fetchBorrowed();
  };

  /* ================= INITIAL ================= */

  useEffect(() => {
    if (user?.token) {
      loadAllData();
    }
  }, [user]);

  /* ================= FILTER ================= */

  const filteredBooks = useMemo(() => {
    let result = [...books];

    /* SEARCH */

    result = result.filter((book) =>
      book.title
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );

    /* FILTER */

    if (filter === "available") {
      result = result.filter(
        (b) => b.availableCopies > 0
      );
    }

    if (filter === "borrowed") {
      result = result.filter(
        (b) => b.availableCopies <= 0
      );
    }

    /* SORT */

    if (sort === "az") {
      result.sort((a, b) =>
        a.title.localeCompare(b.title)
      );
    }

    if (sort === "za") {
      result.sort((a, b) =>
        b.title.localeCompare(a.title)
      );
    }

    return result;
  }, [books, search, filter, sort]);

  /* ================= BORROW ================= */

  const handleBorrow = async (bookId) => {
    try {
      setLoadingId(bookId);

      const res =
        await borrowBook(bookId);

      toast.success(
        res.message ||
          "Book borrowed successfully"
      );

      /* instantly update borrowed UI */

      setBorrowedBooks((prev) => [
        ...prev,
        String(bookId),
      ]);

      /* reduce copies instantly */

      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          String(book._id) ===
          String(bookId)
            ? {
                ...book,
                availableCopies:
                  book.availableCopies - 1,
              }
            : book
        )
      );

      await loadAllData();
    } catch (err) {
      console.log(err);

      toast.error(
        err.response?.data?.message ||
          "Borrow failed"
      );
    } finally {
      setLoadingId(null);
    }
  };

  /* ================= RESERVE ================= */

  const handleJoinQueue = async (
    bookId
  ) => {
    try {
      setLoadingId(bookId);

      const res =
        await joinQueue(bookId);

      toast.success(
        res.message || "Reserved"
      );

      /* instantly update reserve UI */

      setReservedBooks((prev) => [
        ...prev,
        String(bookId),
      ]);

      await loadAllData();
    } catch (err) {
      console.log(err);

      toast.error(
        err.response?.data?.message ||
          "Reserve failed"
      );
    } finally {
      setLoadingId(null);
    }
  };

  /* ================= REVIEW ================= */

  const handleReview = async () => {
    try {
      await addReview(
        selectedBook._id,
        {
          rating,
          comment,
        }
      );

      toast.success(
        "Review added"
      );

      setSelectedBook(null);

      setComment("");

      setRating(5);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Review failed"
      );
    }
  };

  return (
    <div className="dashboard-container">

      {/* ================= HEADER ================= */}

      <div className="books-header">

        <h2 className="books-title">
          📚 Books Library
        </h2>

        <div className="books-count">
          Total Books:
          {" "}
          {filteredBooks.length}
        </div>

      </div>

      {/* ================= SEARCH ================= */}

      <input
        type="text"
        placeholder="Search books..."
        className="search-bar"
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      {/* ================= FILTER ================= */}

      <div className="filter-section">

        <select
          value={filter}
          onChange={(e) =>
            setFilter(e.target.value)
          }
        >
          <option value="all">
            All Books
          </option>

          <option value="available">
            Available
          </option>

          <option value="borrowed">
            Unavailable
          </option>
        </select>

        <select
          value={sort}
          onChange={(e) =>
            setSort(e.target.value)
          }
        >
          <option value="none">
            Sort
          </option>

          <option value="az">
            A-Z
          </option>

          <option value="za">
            Z-A
          </option>
        </select>

      </div>

      {/* ================= GRID ================= */}

      <div className="book-grid">

        {filteredBooks.map((book) => {

          const isReserved =
            reservedBooks.includes(
              String(book._id)
            );

          const isBorrowed =
            borrowedBooks.includes(
              String(book._id)
            );

          return (
            <motion.div
              key={book._id}
              className="book-card"
              whileHover={{
                scale: 1.03,
              }}
            >

              {/* IMAGE */}

              <img
                src={getBookImage(
                  book.title
                )}
                alt={book.title}
                className="book-image"
                onError={(e) =>
                  (e.target.src =
                    "/default.jpg")
                }
              />

              {/* TITLE */}

              <h3>{book.title}</h3>

              {/* AUTHOR */}

              <p className="author-text">
                ✍ {book.author}
              </p>

              {/* GENRE */}

              <span className="genre-badge">
                {book.genre ||
                  "General"}
              </span>

              {/* DESCRIPTION */}

              <p className="book-description">
                {book.description?.slice(
                  0,
                  90
                ) ||
                  "No description available"}
              </p>

              {/* RATING */}

              <p className="rating-text">
                ⭐{" "}
                {book.averageRating?.toFixed(
                  1
                ) || 0}
              </p>

              {/* STATUS */}

              <p className="book-status">

                {book.availableCopies >
                0
                  ? "🟢 Available"
                  : "🔴 Unavailable"}

              </p>

              {/* COPIES */}

              <p className="copies-text">
                Copies:
                {" "}
                {book.availableCopies}
              </p>

              {/* ================= ACTIONS ================= */}

              <div className="book-actions">

                {/* ALREADY BORROWED */}

                {isBorrowed ? (

                  <button
                    className="borrow-btn"
                    disabled
                  >
                    Borrowed
                  </button>

                ) : book.availableCopies >
                  0 ? (

                  <button
                    className="borrow-btn"
                    disabled={
                      loadingId ===
                      book._id
                    }
                    onClick={() =>
                      handleBorrow(
                        book._id
                      )
                    }
                  >
                    {loadingId ===
                    book._id
                      ? "Loading..."
                      : "Borrow"}
                  </button>

                ) : isReserved ? (

                  <button
                    className="queue-btn"
                    disabled
                  >
                    Reserved
                  </button>

                ) : (

                  <button
                    className="queue-btn"
                    disabled={
                      loadingId ===
                      book._id
                    }
                    onClick={() =>
                      handleJoinQueue(
                        book._id
                      )
                    }
                  >
                    {loadingId ===
                    book._id
                      ? "Loading..."
                      : "Reserve"}
                  </button>

                )}

                {/* REVIEW */}

                <button
                  className="review-btn"
                  onClick={() =>
                    setSelectedBook(
                      book
                    )
                  }
                >
                  Review
                </button>

              </div>

            </motion.div>
          );
        })}

      </div>

      {/* ================= EMPTY ================= */}

      {filteredBooks.length ===
        0 && (
        <div className="empty-state">
          📭 No books found
        </div>
      )}

      {/* ================= REVIEW MODAL ================= */}

      {selectedBook && (

        <div className="review-modal">

          <div className="review-box">

            <h3>
              ⭐ Review Book
            </h3>

            <h4>
              {selectedBook.title}
            </h4>

            <select
              value={rating}
              onChange={(e) =>
                setRating(
                  e.target.value
                )
              }
            >
              <option value="5">
                ⭐⭐⭐⭐⭐
              </option>

              <option value="4">
                ⭐⭐⭐⭐
              </option>

              <option value="3">
                ⭐⭐⭐
              </option>

              <option value="2">
                ⭐⭐
              </option>

              <option value="1">
                ⭐
              </option>
            </select>

            <textarea
              placeholder="Write review..."
              value={comment}
              onChange={(e) =>
                setComment(
                  e.target.value
                )
              }
            />

            <div className="review-buttons">

              <button
                onClick={
                  handleReview
                }
              >
                Submit
              </button>

              <button
                onClick={() =>
                  setSelectedBook(
                    null
                  )
                }
              >
                Cancel
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default Books;