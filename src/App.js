import { useState, useEffect } from 'react';
import SearchBar from './components/searchBar';
import { searchMovies } from './api';

function App() {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);

  const handleSearch = async (query) => {
    try {
      const results = await searchMovies(query);
      setMovies(results);
      setError(null);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setError('Something went wrong. Please try again.');
      setMovies([]);
    }
  };

  // Test with "Avengers" on first load
  useEffect(() => {
    handleSearch('Avengers');
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Movie Database</h1>
      <SearchBar onSearch={handleSearch} />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {movies.map((movie) => (
          <li key={movie.id}>{movie.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;