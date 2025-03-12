import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SearchBar from './components/searchBar';
import MovieCard from './components/movieCard';
import MovieDetails from './components/movieDetails';
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

  useEffect(() => {
    handleSearch('Avengers');
  }, []);

  return (
    <Router>
      <div style={{ padding: '20px' }}>
        <h1>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Movie Database
          </Link>
        </h1>
        <SearchBar onSearch={handleSearch} />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <Routes>
          <Route
            path="/"
            element={
              <div>
                {movies.map((movie) => (
                  <Link key={movie.id} to={`/movie/${movie.id}`}>
                    <MovieCard movie={movie} />
                  </Link>
                ))}
              </div>
            }
          />
          <Route path="/movie/:id" element={<MovieDetails movies={movies} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;