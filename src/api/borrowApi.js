import API from "./axios";

export const borrowBook = (bookId) =>
  API.post("/borrow", { bookId });

export const returnBook = (borrowId) =>
  API.put(`/borrow/return/${borrowId}`);

export const getMyBorrows = () =>
  API.get("/borrow/my");

export const getAllBorrows = () =>
  API.get("/borrow/all");
