import { useEffect, useState } from "react";
import axios from "../api/axios";
import { motion } from "framer-motion";

const bookImages = {
  "React Guide": "/react guide.jpg",
  "Geographical Tales": "/geo tales.jpg",
  "Harry Potter": "/harry potter.jpg",
  "Java Guide": "/java.jpg",
  "Children's Tales": "/childrens tales.jpg",
  "Lessons of Maths": "/maths.jpg",
  "Little Ones": "/little ones.jpg",
};


const Books = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("none");

  const fetchBooks = async () => {
    try {
      const res = await axios.get("/books");
      setBooks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // 🔍 SEARCH + FILTER + SORT
  let filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(search.toLowerCase())
  );

  if (filter === "available") {
    filteredBooks = filteredBooks.filter((b) => b.available);
  } else if (filter === "borrowed") {
    filteredBooks = filteredBooks.filter((b) => !b.available);
  }

  if (sort === "az") {
    filteredBooks.sort((a, b) => a.title.localeCompare(b.title));
  }

  // 📚 ACTIONS
  const borrowBook = async (id) => {
    try {
      await axios.post(`/borrow/${id}`);
      alert("Book borrowed!");
      fetchBooks();
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  const reserveBook = async (id) => {
    try {
      await axios.post(`/books/reserve/${id}`);
      alert("Book reserved!");
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  return (
    <div className="dashboard-container">
      <h2>📚 Books Library</h2>

      {/* 🔍 SEARCH */}
      <input
        type="text"
        placeholder="Search books..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-bar"
      />

      {/* 🎯 FILTER + SORT */}
      <div style={{ margin: "15px 0", display: "flex", gap: "10px" }}>
        <select onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="available">Available</option>
          <option value="borrowed">Borrowed</option>
        </select>

        <select onChange={(e) => setSort(e.target.value)}>
          <option value="none">Sort</option>
          <option value="az">A-Z</option>
        </select>
      </div>

      {/* 📚 GRID */}
      <div className="book-grid">
        {filteredBooks.map((book) => (
          <motion.div
            key={book._id}
            className="book-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
          >
            {/* 📷 IMAGE */}
            <img
              src={bookImages[book.title] || "/default.jpg"}
              alt={book.title}
              className="book-image"
            />

            <h3>{book.title}</h3>
            <p>{book.author}</p>

            <p>
              {book.available ? "🟢 Available" : "🔴 Borrowed"}
            </p>

            {/* 🎯 ACTION BUTTONS */}
            {book.available ? (
              <button
                className="borrow-btn"
                onClick={() => borrowBook(book._id)}
              >
                Borrow
              </button>
            ) : (
              <button
                className="return-btn"
                onClick={() => reserveBook(book._id)}
              >
                Reserve
              </button>
            )}
          </motion.div>
        ))}
      </div>

      {/* ❌ EMPTY STATE */}
      {filteredBooks.length === 0 && (
        <p style={{ marginTop: "20px" }}>No books found 📭</p>
      )}
    </div>
  );
};

export default Books;