import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { getBooks, joinQueue } from "../api/bookApi";

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
  const [books, setBooks] = useState([]);

  const [reservedBooks, setReservedBooks] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState("all");

  const [sort, setSort] =
    useState("none");

  const [loadingId, setLoadingId] =
    useState(null);

  const { user } = useAuth();

  /* ================= FETCH BOOKS ================= */

  const fetchBooks = async () => {
    try {
      const res = await getBooks();

      const booksData =
        res?.books ||
        res?.data?.books ||
        res?.data ||
        [];

      setBooks(
        Array.isArray(booksData)
          ? booksData
          : []
      );
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to fetch books"
      );

      setBooks([]);
    }
  };

  /* ================= FETCH RESERVED ================= */

  const fetchReserved = async () => {
    try {
      const res =
        await getMyReservedBooks();

      const records =
        res?.records ||
        res?.data ||
        res ||
        [];

      const reservedIds = records.map(
        (r) => r.book?._id
      );

      setReservedBooks(reservedIds);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= INITIAL LOAD ================= */

  useEffect(() => {
    if (user?.token) {
      fetchBooks();
      fetchReserved();
    }
  }, [user]);

  /* ================= FILTER + SORT ================= */

  const filteredBooks = useMemo(() => {
    let result = [...books];

    /* SEARCH */

    result = result.filter((book) =>
      book?.title
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
  }, [books, search, filter, sort]);

  /* ================= BORROW ================= */

  const handleBorrow = async (
    bookId
  ) => {
    try {
      setLoadingId(bookId);

      await borrowBook(bookId);

      toast.success(
        "Book borrowed successfully!"
      );

      await fetchBooks();
      await fetchReserved();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Borrow failed"
      );
    } finally {
      setLoadingId(null);
    }
  };

  /* ================= JOIN QUEUE ================= */

  const handleJoinQueue = async (
    id
  ) => {
    try {
      setLoadingId(id);

      const res = await joinQueue(id);

      toast.success(res.message);

      await fetchBooks();
      await fetchReserved();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to join queue"
      );
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="dashboard-container">

      {/* ================= TITLE ================= */}

      <h2 className="books-title">
        📚 Books Library
      </h2>

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

      {/* ================= FILTER + SORT ================= */}

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

      {/* ================= BOOK GRID ================= */}

      <div className="book-grid">

        {filteredBooks.map((book) => {

          const isReserved =
            reservedBooks.includes(
              book._id
            );

          return (
            <motion.div
              key={book._id}
              className="book-card"
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              whileHover={{
                scale: 1.04,
              }}
            >

              {/* ================= IMAGE ================= */}

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

              {/* ================= TITLE ================= */}

              <h3>{book.title}</h3>

              {/* ================= AUTHOR ================= */}

              <p className="author-text">
                ✍ {book.author}
              </p>

              {/* ================= STATUS ================= */}

              <p className="book-status">
                {book.availableCopies > 0
                  ? "🟢 Available"
                  : "🔴 Unavailable"}
              </p>

              {/* ================= COPIES ================= */}

              <p className="copies-text">
                Copies Available:{" "}
                {
                  book.availableCopies
                }
              </p>

              {/* ================= QUEUE ================= */}

              {book.availableCopies <= 0 && (
                <p className="queue-text">
                  Queue:
                  {" "}
                  {book
                    .reservationQueue
                    ?.length || 0}
                </p>
              )}

              {/* ================= BORROW ================= */}

              {book.availableCopies > 0 && (
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
                    : "Borrow Book"}
                </button>
              )}

              {/* ================= JOIN QUEUE ================= */}

              {book.availableCopies <= 0 && (
                <button
                  className="queue-btn"
                  disabled={
                    isReserved ||
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
                    : isReserved
                    ? "Already Queued"
                    : "⏳ Join Queue"}
                </button>
              )}

            </motion.div>
          );
        })}
      </div>

      {/* ================= EMPTY ================= */}

      {filteredBooks.length ===
        0 && (
        <p className="no-data">
          No books found 📭
        </p>
      )}
    </div>
  );
};

export default Books;