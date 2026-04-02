import { useEffect, useState } from "react";
import axios from "../api/axios";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");

  const fetchBooks = async () => {
    const res = await axios.get("/books");
    setBooks(res.data);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4">
      <h2>📚 Books</h2>

      <input
        type="text"
        placeholder="Search books..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-box"
      />

      <div className="book-grid">
        {filteredBooks.map((book) => (
          <div className="book-card" key={book._id}>
            <h3>{book.title}</h3>
            <p>{book.author}</p>

            <p>
              Status:{" "}
              {book.available ? "✅ Available" : "❌ Borrowed"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Books;