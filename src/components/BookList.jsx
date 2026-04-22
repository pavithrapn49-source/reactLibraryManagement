import { motion } from "framer-motion";

export default function BookList({ books, onDelete, onEdit }) {
  if (!books || books.length === 0) {
    return <p className="text-gray-500">No books available 📭</p>;
  }

  return (
    <ul className="space-y-3">
      {books.map((b) => (
        <motion.li
          key={b._id || b.id}
          className="border rounded-md p-3 flex justify-between items-center shadow-sm hover:shadow-md transition"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-3">
            {b.image && (
              <img
                src={b.image}
                alt={b.title}
                className="w-12 h-16 object-cover rounded"
                onError={(e) => (e.target.src = "/default.jpg")}
              />
            )}
            <div>
              <span className="font-semibold">{b.title}</span>
              <p className="text-sm text-gray-600">{b.author}</p>
              {b.available !== undefined && (
                <p
                  className={`text-xs ${
                    b.available ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {b.available ? "Available" : "Borrowed"}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            {onEdit && (
              <button
                onClick={() => onEdit(b._id || b.id)}
                className="px-2 py-1 text-blue-600 hover:text-blue-800 text-sm"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(b._id || b.id)}
                className="px-2 py-1 text-red-600 hover:text-red-800 text-sm"
              >
                Delete
              </button>
            )}
          </div>
        </motion.li>
      ))}
    </ul>
  );
}
