import API from "./axios";

// ================= BORROW BOOK =================
export const borrowBook = async (bookId) => {
  const res = await API.post(`/transactions/borrow/${bookId}`);
  return res.data;
};

// ================= RETURN BOOK =================
export const returnBook = async (borrowId) => {
  const res = await API.put(`/transactions/return/${borrowId}`);
  return res.data;
};

// ================= MY BORROWS =================
export const getMyBorrows = async () => {
  const res = await API.get("/transactions/my-borrows");
  return res.data;
};

// ================= HISTORY =================
export const getHistory = async () => {
  const res = await API.get("/transactions/history");
  return res.data;
};

// ================= ALL BORROWS =================
export const getAllBorrows = async () => {
  const res = await API.get("/transactions");
  return res.data;
};

export default {
  borrowBook,
  returnBook,
  getMyBorrows,
  getHistory,
  getAllBorrows,
};