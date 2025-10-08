// Main React component for the Book Explorer application
// This is the root component that manages state and renders the UI

import React, { useState } from 'react';
import { searchBooks } from './bookApi';
import './App.css';

function App() {
  // State management
  const [books, setBooks] = useState([]);          // Array of book results from API
  const [loading, setLoading] = useState(false);   // Loading state for API calls
  const [error, setError] = useState('');          // Error message state
  const [query, setQuery] = useState('');          // Search query input

  /**
   * Handles the search form submission
   * @param {Event} e - Form submission event
   */
  const handleSearch = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    
    // Don't search if query is empty
    if (!query.trim()) return;

    // Set loading state and clear previous errors
    setLoading(true);
    setError('');
    
    try {
      // Call the API to search for books
      const results = await searchBooks(query);
      
      // Update state with search results
      setBooks(results);
    } catch (err) {
      // Handle any errors from the API call
      setError(err.message);
      setBooks([]); // Clear any previous results
    } finally {
      // Reset loading state regardless of success/failure
      setLoading(false);
    }
  };

  // Render the component UI
  return (
    <div className="app">
      {/* Application Header */}
      <div className="app-header">
        <h1 className="app-title">📚 Book Explorer</h1>
        <p className="app-subtitle">Discover millions of books from Open Library</p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-container">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)} // Update query state on input change
            placeholder="Search for books, authors, or subjects..."
            className="search-input"
            disabled={loading} // Disable input while loading
          />
          <button 
            type="submit" 
            disabled={loading || !query.trim()} // Disable button when loading or empty query
            className="search-button"
          >
            {/* Show loading text when searching */}
            {loading ? '🔍 Searching...' : '🔍 Search'}
          </button>
        </div>
      </form>

      {/* Error Display */}
      {error && (
        <div className="error-message">
          <div className="error-icon">⚠️</div>
          <h3>Something went wrong</h3>
          <p>{error}</p>
          {/* Retry button that triggers the search again */}
          <button 
            onClick={() => handleSearch({ preventDefault: () => {} })} // Simulate form submission
            className="retry-button"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Loading Spinner */}
      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Searching for books...</p>
        </div>
      )}

      {/* Results Section */}
      <div className="results">
        {/* Results Header - Only show when we have books */}
        {books.length > 0 && (
          <h2 className="results-title">
            Found {books.length} book{books.length !== 1 ? 's' : ''} for "{query}"
          </h2>
        )}
        
        {/* Books Grid - Display books in a responsive grid */}
        <div className="books-grid">
          {books.map((book, index) => (
            <div key={index} className="book-card">
              {/* Book Header with title and cover image */}
              <div className="book-header">
                <h3 className="book-title">
                  {/* Link to the book's page on Open Library */}
                  <a 
                    href={`https://openlibrary.org${book.key}`}
                    target="_blank" // Open in new tab
                    rel="noopener noreferrer" // Security best practice
                    className="book-link"
                  >
                    {book.title}
                  </a>
                </h3>
                {/* Book cover image - only show if available */}
                {book.cover_i && (
                  <img 
                    src={`https://covers.openlibrary.org/b/id/${book.cover_i}-S.jpg`}
                    alt={book.title}
                    className="book-cover"
                  />
                )}
              </div>
              
              {/* Book author information */}
              <p className="book-author">
                <strong>By:</strong> {book.author_name ? book.author_name.join(', ') : 'Unknown Author'}
              </p>
              
              {/* Publication year */}
              <p className="book-year">
                <strong>Published:</strong> {book.first_publish_year || 'Unknown'}
              </p>
              
              {/* ISBN number - only show if available */}
              {book.isbn && (
                <p className="book-isbn">
                  <strong>ISBN:</strong> {book.isbn[0]}
                </p>
              )}
              
              {/* Subject tags - show first 3 subjects */}
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

        {/* No Results Message - Show when search returns no books */}
        {books.length === 0 && !loading && query && (
          <div className="no-results">
            <h3>No books found</h3>
            <p>Try searching for something else</p>
          </div>
        )}
      </div>

      {/* Application Footer */}
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