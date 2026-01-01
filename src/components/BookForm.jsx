import { useState } from "react";

export default function BookForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");

  const submit = (e) => {
    e.preventDefault();
    onAdd({ title, author });
    setTitle("");
    setAuthor("");
  };

  return (
    <form onSubmit={submit} className="space-y-2 mb-4">
      <input className="border p-2 w-full" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input className="border p-2 w-full" placeholder="Author" value={author} onChange={(e) => setAuthor(e.target.value)} />
      <button className="bg-blue-600 text-white px-4 py-2 rounded">Add Book</button>
    </form>
  );
}
