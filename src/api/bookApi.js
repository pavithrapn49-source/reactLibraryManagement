import API from "./axios";

export const getBooks = () => API.get("/books");
