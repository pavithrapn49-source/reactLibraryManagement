import { useState } from "react";
import { addBook } from "../api/books"; 
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddBook = () => {
  const [form, setForm] = useState({
    title: "",
    author: "",
    isbn: "",
    genre: "",
    publicationYear: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation
    if (!form.title || !form.author) {
      toast.error("Title and Author are required");
      return;
    }

    try {
      await addBook(form);
      toast.success("Book added successfully!");
      setForm({ title: "", author: "", isbn: "", genre: "", publicationYear: "" });
      navigate("/books"); // redirect to books list
    } catch (err) {
      toast.error(err.message || "Failed to add book");
    }
  };

  return (
    <div className="add-book-container">
      <h2>➕ Add New Book</h2>
      <form onSubmit={handleSubmit} className="add-book-form">
        <input
          type="text"
          name="title"
          placeholder="Book Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="author"
          placeholder="Author"
          value={form.author}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="isbn"
          placeholder="ISBN"
          value={form.isbn}
          onChange={handleChange}
        />
        <input
          type="text"
          name="genre"
          placeholder="Genre"
          value={form.genre}
          onChange={handleChange}
        />
        <input
          type="number"
          name="publicationYear"
          placeholder="Publication Year"
          value={form.publicationYear}
          onChange={handleChange}
        />

        <button type="submit">Add Book</button>
      </form>
    </div>
  );
};

export default AddBook;
