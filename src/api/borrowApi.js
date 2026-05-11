import API from "./axios";

/* ================= RESERVE BOOK ================= */
export const reserveBook = async (bookId) => {
  const res = await API.post("/borrow/reserve", { bookId });
  return res.data;
};

/* ================= BORROW BOOK ================= */
export const borrowBook = async (bookId) => {
  const res = await API.post("/borrow/borrow", { bookId });
  return res.data;
};

/* ================= RETURN BOOK ================= */
export const returnBook = async (borrowId) => {
  const res = await API.post("/borrow/return", { borrowId });
  return res.data;
};

/* ================= RESERVED BOOKS ================= */
export const getMyReservedBooks = async () => {
  const res = await API.get("/borrow/reserved");
  return res.data;
};

/* ================= BORROWED BOOKS ================= */
export const getMyBorrows = async () => {
  const res = await API.get("/borrow/borrowed");
  return res.data;
};

/* ================= RETURNED BOOKS ================= */
export const getMyReturnedBooks = async () => {
  const res = await API.get("/borrow/returned");
  return res.data;
};

/* ================= FULL HISTORY ================= */
export const getMyHistory = async () => {
  const res = await API.get("/borrow/history");
  return res.data;
};

export default {
  reserveBook,
  borrowBook,
  returnBook,
  getMyReservedBooks,
  getMyBorrows,
  getMyReturnedBooks,
  getMyHistory,
};