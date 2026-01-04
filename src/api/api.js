import axios from "axios";
import API from "../api/api";


const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Attach token automatically
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  },
  (error) => Promise.reject(error)
);

export default API;

/* Books */
export const getBooks = () => API.get("/books");

/* Borrow APIs */
export const borrowBook = (bookId) =>
  API.post("/borrow", { bookId });

export const returnBook = (borrowId) =>
  API.put(`/borrow/return/${borrowId}`);

export const getMyBorrows = () =>
  API.get("/borrow/my");

/* Admin */
export const getAllBorrows = () =>
  API.get("/borrow/all");
