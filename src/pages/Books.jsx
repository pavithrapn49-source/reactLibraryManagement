import "../styles/common.css";
import "../styles/books.css";

export default function Books() {
  return (
    <div className="page">
      <h1 className="title">Books</h1>

      <div className="books-grid">
        <div className="book-card">
          <p className="book-title">React Guide</p>
          <p className="book-author">Pavi</p>
          <p className="book-price">₹499</p>
        </div>

        <div className="book-card">
          <p className="book-title">Java Guide</p>
          <p className="book-author">Anandh</p>
          <p className="book-price">₹699</p>
        </div>

        <div className="book-card">
          <p className="book-title">Harry Potter</p>
          <p className="book-author">Shajan</p>
          <p className="book-price">₹999</p>
        </div>

        <div className="book-card">
          <p className="book-title">Geographical Tale</p>
          <p className="book-author">Ramu</p>
          <p className="book-price">₹980</p>
        </div>

        <div className="book-card">
          <p className="book-title">Children's Tale</p>
          <p className="book-author">Saanvi</p>
          <p className="book-price">₹600</p>
        </div>

      </div>
    </div>
  );
}
