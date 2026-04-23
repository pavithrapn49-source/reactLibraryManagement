import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { getBooks, reserveBook } from "../api/bookApi";
import { borrowBook } from "../api/borrowApi";
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
    (k) => k.toLowerCase() === (title || "").trim().toLowerCase()
  );

  return key ? bookImages[key] : "/default.jpg";
};

const Books = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("none");
  const [loadingId, setLoadingId] = useState(null);

  const { user } = useAuth();

  const authHeaders = () => ({
    headers: {
      Authorization: `Bearer ${user?.token}`,
    },
  });

  /* ================= FETCH BOOKS (FIXED) ================= */
  const fetchBooks = async () => {
    try {
      const res = await getBooks();

      // ✅ FIX: handle all API formats safely
      const booksData =
        res?.books || res?.data?.books || res?.data || [];

      setBooks(Array.isArray(booksData) ? booksData : []);
    } catch (err) {
      toast.error(err.message || "Failed to fetch books");
      setBooks([]);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  /* ================= FILTER + SORT ================= */
  const filteredBooks = useMemo(() => {
    let result = [...(books || [])];

    // SEARCH
    result = result.filter((book) =>
      book?.title?.toLowerCase().includes(search.toLowerCase())
    );

    // FILTER
    if (filter === "available") {
      result = result.filter((b) => b.available === true);
    }

    if (filter === "borrowed") {
      result = result.filter((b) => b.available === false);
    }

    // SORT
    if (sort === "az") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    if (sort === "za") {
      result.sort((a, b) => b.title.localeCompare(a.title));
    }

    return result;
  }, [books, search, filter, sort]);

  /* ================= BORROW ================= */
  const handleBorrow = async (id) => {
    try {
      setLoadingId(id);
      await borrowBook(id);
      toast.success("Book borrowed successfully!");
      fetchBooks();
    } catch (err) {
      toast.error(err.message || "Error borrowing book");
    } finally {
      setLoadingId(null);
    }
  };

  /* ================= RESERVE ================= */
  const handleReserve = async (id) => {
    try {
      setLoadingId(id);
      await reserveBook(id);
      toast.success("Book reserved successfully!");
      fetchBooks();
    } catch (err) {
      toast.error(err.message || "Error reserving book");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="dashboard-container">
      <h2 className="text-2xl font-bold mb-4">📚 Books Library</h2>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search books..."
        className="search-bar"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* FILTER + SORT */}
      <div className="flex gap-4 my-4">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="available">Available</option>
          <option value="borrowed">Borrowed</option>
        </select>

        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="none">Sort</option>
          <option value="az">A-Z</option>
          <option value="za">Z-A</option>
        </select>
      </div>

      {/* BOOK GRID */}
      <div className="book-grid">
        {filteredBooks.map((book) => (
          <motion.div
            key={book._id}
            className="book-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
          >
            <img
              src={getBookImage(book.title)}
              alt={book.title}
              className="book-image"
              onError={(e) => {
                e.target.src = "/default.jpg";
              }}
            />

            <h3>{book.title}</h3>
            <p>{book.author}</p>

            <p>
              {book.available ? "🟢 Available" : "🔴 Borrowed"}
            </p>

            {/* ACTIONS */}
            {book.available ? (
              <button
                disabled={loadingId === book._id}
                onClick={() => handleBorrow(book._id)}
              >
                {loadingId === book._id ? "Loading..." : "Borrow"}
              </button>
            ) : (
              <button
                disabled={loadingId === book._id}
                onClick={() => handleReserve(book._id)}
              >
                {loadingId === book._id ? "Loading..." : "Reserve"}
              </button>
            )}
          </motion.div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {filteredBooks.length === 0 && (
        <p className="mt-4 text-gray-500">
          No books found 📭
        </p>
      )}
    </div>
  );
};

export default Books;