const BASE_URL = 'https://openlibrary.org';

export async function searchBooks(query) {
    try {
    const response = await fetch(
      `${BASE_URL}/search.json?q=${encodeURIComponent(query)}&limit=10`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.docs || [];
  } catch (error) {
    throw new Error(`Failed to search books: ${error.message}`);
  }

}