import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SearchBar from './components/searchBar';
import MovieCard from './components/movieCard';
import MovieDetails from './components/movieDetails';
import { searchMovies } from './api';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const results = await searchMovies(query);
      setMovies(results);
      setError(null);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setError('Something went wrong. Please try again.');
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch('Avengers');
  }, []);

  return (
    <Router>
      <div className="app-container">
        <h1>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Movie Database
          </Link>
        </h1>
        <SearchBar onSearch={handleSearch} />
        {error && <p className="error">{error}</p>}
        {loading && <p className="loading">Loading...</p>}
        <Routes>
          <Route
            path="/"
            element={
              <div className="movie-grid">
                {movies.map((movie) => (
                  <Link key={movie.id} to={`/movie/${movie.id}`} className="movie-card">
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