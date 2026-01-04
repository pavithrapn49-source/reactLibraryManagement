import axios from "axios";
const API = import.meta.env.VITE_API_URL;

axios.get(`${API}/books`);


API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;

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
