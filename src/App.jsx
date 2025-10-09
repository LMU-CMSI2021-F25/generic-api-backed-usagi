import React, { useState } from 'react';
import { searchBooks } from './bookApi';
import './App.css';

function App() {
  const [books, setBooks] = useState([]);          
  const [loading, setLoading] = useState(false);   
  const [error, setError] = useState('');          
  const [query, setQuery] = useState('');         

  
  const handleSearch = async (e) => {
    e.preventDefault(); 
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    
    try {
      const results = await searchBooks(query);
      setBooks(results);
    } catch (errors) {
      setError(errors.message);
      setBooks([]); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="app-header">
        <h1 className="app-title">📚 Book Explorer</h1>
      </div>
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-container">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)} 
            placeholder="Search for books, authors, or subjects..."
            className="search-input"
            disabled={loading} 
          />
          <button 
            type="submit" 
            disabled={loading || !query.trim()}
            className="search-button"
          >
            {loading ? '🔍 Searching...' : '🔍 Search'}
          </button>
        </div>
      </form>
      {error && (
        <div className="error-message">
          <div className="error-icon">⚠️</div>
          <h3>Something went wrong</h3>
          <p>{error}</p>
          <button 
            onClick={() => handleSearch({ preventDefault: () => {} })} 
            className="retry-button"
          >
            Try Again
          </button>
        </div>
      )}
      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Searching for books...</p>
        </div>
      )}
      <div className="results">
        {books.length > 0 && (
          <h2 className="results-title">
            Found {books.length} book{books.length !== 1 ? 's' : ''} for "{query}"
          </h2>
        )}
        <div className="books-grid">
          {books.map((book, index) => (
            <div key={index} className="book-card">
              <div className="book-header">
                <h3 className="book-title">
                  <a 
                    href={`https://openlibrary.org${book.key}`}
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="book-link"
                  >
                    {book.title}
                  </a>
                </h3>
                {book.cover_i && (
                  <img 
                    src={`https://covers.openlibrary.org/b/id/${book.cover_i}-S.jpg`}
                    alt={book.title}
                    className="book-cover"
                  />
                )}
              </div>
              <p className="book-author">
                <strong>By:</strong> {book.author_name ? book.author_name.join(', ') : 'Unknown Author'}
              </p>
              <p className="book-year">
                <strong>Published:</strong> {book.first_publish_year || 'Unknown'}
              </p>
              {book.isbn && (
                <p className="book-isbn">
                  <strong>ISBN:</strong> {book.isbn[0]}
                </p>
              )}
              {book.subject && (
                <div className="subjects">
                  {book.subject.slice(0, 3).map((subject, idx) => (
                    <span key={idx} className="subject-tag">
                      {subject}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        {books.length === 0 && !loading && query && (
          <div className="no-results">
            <h3>No books found</h3>
            <p>Try searching for something else</p>
          </div>
        )}
      </div>
      <footer className="signature-footer">
        <div className="signature">
          <span className="made-by">Made by Cindy</span>
          <img 
            src="https://i.pinimg.com/736x/f8/0a/e1/f80ae1895f0be9d25ffc20f748cf909b.jpg"
            alt="Hachiware taking photo" 
            className="signature-image"
          />
        </div>
      </footer>
    </div>
  );
}
export default App;