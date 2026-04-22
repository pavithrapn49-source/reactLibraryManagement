import API from "./axios";

/* =====================================
   GET BOOKS
   Search + Filter + Sort + Pagination
===================================== */
export const getBooks = async (params = {}) => {
  const res = await API.get("/books", { params });
  return res.data;
};

/* =====================================
   GET SINGLE BOOK
===================================== */
export const getBookById = async (id) => {
  const res = await API.get(`/books/${id}`);
  return res.data;
};

/* =====================================
   ADD BOOK (Admin)
===================================== */
export const addBook = async (payload) => {
  const res = await API.post("/books/add", payload);
  return res.data;
};

/* =====================================
   UPDATE BOOK (If Route Exists)
===================================== */
export const updateBook = async (id, payload) => {
  const res = await API.put(`/books/${id}`, payload);
  return res.data;
};

/* =====================================
   DELETE BOOK (If Route Exists)
===================================== */
export const deleteBook = async (id) => {
  const res = await API.delete(`/books/${id}`);
  return res.data;
};

/* =====================================
   RESERVE BOOK
===================================== */
export const reserveBook = async (id) => {
  const res = await API.post(`/books/reserve/${id}`);
  return res.data;
};

export default {
  getBooks,
  getBookById,
  addBook,
  updateBook,
  deleteBook,
  reserveBook,
};