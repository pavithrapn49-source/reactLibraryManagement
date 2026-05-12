import API from "./axios";

/* =====================================
   GET ALL BOOKS
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
   ADD BOOK
===================================== */
export const addBook = async (payload) => {
  // backend route = POST /api/books
  const res = await API.post("/books", payload);
  return res.data;
};

/* =====================================
   UPDATE BOOK
===================================== */
export const updateBook = async (id, payload) => {
  const res = await API.put(`/books/${id}`, payload);
  return res.data;
};

/* =====================================
   DELETE BOOK
===================================== */
export const deleteBook = async (id) => {
  const res = await API.delete(`/books/${id}`);
  return res.data;
};

export const joinQueue = async (id) => {
  const res = await API.post(
    `/books/${id}/join-queue`
  );

  return res.data;
};

export const getReservedForMe =
  async () => {

    const res = await API.get(
      "/books/reserved/me"
    );

    return res.data;
  };

  export const addReview =
  async (
    bookId,
    reviewData
  ) => {

    const res =
      await API.post(
        `/books/${bookId}/review`,
        reviewData
      );

    return res.data;
  };

export default {
  getBooks,
  getBookById,
  addBook,
  updateBook,
  deleteBook,
};