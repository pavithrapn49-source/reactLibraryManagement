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
} from "../api/borrowApi";

import { toast } from "react-toastify";

import "../styles/books.css";

/* ================= IMAGE MAP ================= */

const bookImages = {
  "React Guide": "/react guide.jpg",
  "Geographical Tales": "/geo tales.jpg",
  "Harry Potter": "/harry potter.jpg",
  "Java Guide": "/java.jpg",
  "Children's Tales":
    "/childrens tales.jpg",
  "Lessons of Maths":
    "/maths.jpg",
  "Little Ones":
    "/little ones.jpg",
};

/* ================= IMAGE HELPER ================= */

const getBookImage = (title) => {
  const key = Object.keys(
    bookImages
  ).find(
    (k) =>
      k.toLowerCase() ===
      (title || "")
        .trim()
        .toLowerCase()
  );

  return key
    ? bookImages[key]
    : "/default.jpg";
};

const Books = () => {
  const { user } = useAuth();

  const [books, setBooks] =
    useState([]);

  const [reservedBooks,
    setReservedBooks,
  ] = useState([]);

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState("all");

  const [sort, setSort] =
    useState("none");

  const [loadingId,
    setLoadingId,
  ] = useState(null);

  /* REVIEW */

  const [selectedBook,
    setSelectedBook,
  ] = useState(null);

  const [rating, setRating] =
    useState(5);

  const [comment, setComment] =
    useState("");

  /* ================= FETCH BOOKS ================= */

  const fetchBooks = async () => {
    try {
      const res = await getBooks();

      const booksData =
        res?.books ||
        res?.data?.books ||
        [];

      setBooks(
        Array.isArray(
          booksData
        )
          ? booksData
          : []
      );
    } catch (err) {
      toast.error(
        err.response?.data
          ?.message ||
          "Failed to fetch books"
      );
    }
  };

  /* ================= RESERVED ================= */

  const fetchReserved =
    async () => {
      try {
        const res =
          await getMyReservedBooks();

        const reservedIds =
          res.map(
            (r) =>
              r.book?._id
          );

        setReservedBooks(
          reservedIds
        );
      } catch (err) {
        console.log(err);
      }
    };

  /* ================= INITIAL ================= */

  useEffect(() => {
    if (user?.token) {
      fetchBooks();
      fetchReserved();
    }
  }, [user]);

  /* ================= FILTER ================= */

  const filteredBooks =
    useMemo(() => {
      let result = [...books];

      /* SEARCH */

      result = result.filter(
        (book) =>
          book.title
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );

      /* FILTER */

      if (
        filter === "available"
      ) {
        result = result.filter(
          (b) =>
            b.availableCopies > 0
        );
      }

      if (
        filter === "borrowed"
      ) {
        result = result.filter(
          (b) =>
            b.availableCopies <= 0
        );
      }

      /* SORT */

      if (sort === "az") {
        result.sort((a, b) =>
          a.title.localeCompare(
            b.title
          )
        );
      }

      if (sort === "za") {
        result.sort((a, b) =>
          b.title.localeCompare(
            a.title
          )
        );
      }

      return result;
    }, [
      books,
      search,
      filter,
      sort,
    ]);

  /* ================= BORROW ================= */

  const handleBorrow =
    async (bookId) => {
      try {
        setLoadingId(bookId);

        await borrowBook(bookId);

        toast.success(
          "Book borrowed!"
        );

        fetchBooks();
      } catch (err) {
        toast.error(
          err.response?.data
            ?.message ||
            "Borrow failed"
        );
      } finally {
        setLoadingId(null);
      }
    };

  /* ================= JOIN QUEUE ================= */

  const handleJoinQueue =
    async (id) => {
      try {
        setLoadingId(id);

        const res =
          await joinQueue(id);

        toast.success(
          res.message
        );

        fetchBooks();

        fetchReserved();
      } catch (error) {
        toast.error(
          error.response?.data
            ?.message ||
            "Failed to join queue"
        );
      } finally {
        setLoadingId(null);
      }
    };

  /* ================= REVIEW ================= */

  const handleReview =
    async () => {
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

        setSelectedBook(
          null
        );

        setComment("");

        setRating(5);

        fetchBooks();
      } catch (err) {
        toast.error(
          err.response?.data
            ?.message
        );
      }
    };

  return (
    <div className="dashboard-container">

      {/* ================= TITLE ================= */}

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
          setSearch(
            e.target.value
          )
        }
      />

      {/* ================= FILTER ================= */}

      <div className="filter-section">

        <select
          value={filter}
          onChange={(e) =>
            setFilter(
              e.target.value
            )
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
            setSort(
              e.target.value
            )
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

        {filteredBooks.map(
          (book) => {

            const isReserved =
              reservedBooks.includes(
                book._id
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

                <h3>
                  {book.title}
                </h3>

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
                  {book.description
                    ?.slice(0, 90) ||
                    "No description available"}
                </p>

                {/* RATING */}

                <p className="rating-text">
                  ⭐
                  {" "}
                  {book.averageRating?.toFixed(
                    1
                  ) || 0}
                  {" "}
                  (
                  {book.numReviews || 0}
                  {" "}
                  reviews)
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
                  {
                    book.availableCopies
                  }
                </p>

                {/* QUEUE */}

                {book.availableCopies <=
                  0 && (
                  <p className="queue-text">
                    Queue:
                    {" "}
                    {book
                      .reservationQueue
                      ?.length || 0}
                  </p>
                )}

                {/* ACTIONS */}

                <div className="book-actions">

                  {book.availableCopies >
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
                  ) : (
                    <button
                      className="queue-btn"
                      disabled={
                        isReserved
                      }
                      onClick={() =>
                        handleJoinQueue(
                          book._id
                        )
                      }
                    >
                      {isReserved
                        ? "Queued"
                        : "Join Queue"}
                    </button>
                  )}

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
          }
        )}

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
              {
                selectedBook.title
              }
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
              placeholder="Write your review..."
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