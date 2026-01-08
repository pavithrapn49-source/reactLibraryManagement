import "../styles/common.css";
import "../styles/books.css";

export default function Books() {
  const books = [
    {
      title: "React Guide",
      author: "Pavi",
      price: 499,
      image: "https://covers.openlibrary.org/b/id/10909258-L.jpg",
    },
    {
      title: "Java Guide",
      author: "Anandh",
      price: 699,
     image: "https://covers.openlibrary.org/b/id/10521270-L.jpg",

    },

    {
      title: "Harry Potter",
      author: "Shajan",
      price: 999,
      image: "https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg",
    },
    {
      title: "Geographical Tale",
      author: "Ramu",
      price: 980,
      image: "https://images-na.ssl-images-amazon.com/images/I/71uAI28kJuL.jpg",
    },
    {
      title: "Children's Tale",
      author: "Saanvi",
      price: 600,
      image: "https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg",
    },
  ];

  return (
    <div className="page">
      <h1 className="title">📚 Library Collection</h1>
      <p className="subtitle">Discover books curated just for you</p>

      <div className="books-grid">
        {books.map((book, index) => (
          <div className="book-card" key={index}>
            <div className="book-image">
              <img src={book.image} alt={book.title} />
            </div>

            <div className="book-info">
              <h3>{book.title}</h3>
              <p className="author">by {book.author}</p>
              <span className="price">₹{book.price}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
