export default function BookList({ books, onDelete }) {
  return (
    <ul className="space-y-2">
      {books.map((b) => (
        <li key={b.id} className="border p-2 flex justify-between">
          <span>{b.title} — {b.author}</span>
          <button onClick={() => onDelete(b.id)} className="text-red-600">Delete</button>
        </li>
      ))}
    </ul>
  );
}
