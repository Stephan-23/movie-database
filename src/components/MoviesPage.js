import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import MovieCard from './movieCard';
import { getTrendingMovies, getMoviesByGenre } from '../api';

function MoviesPage({ selectedGenre }) {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchMovies = async (genreId, pageNum, reset = false) => {
    setLoading(true);
    setError(null);
    try {
      let fetchedMovies;
      if (genreId) {
        fetchedMovies = await getMoviesByGenre(genreId, pageNum);
      } else {
        fetchedMovies = await getTrendingMovies(pageNum);
      }

      if (reset) {
        setMovies(fetchedMovies);
      } else {
        setMovies((prev) => [...prev, ...fetchedMovies]);
      }

      // TMDb API typically returns 20 movies per page. If fewer than 20 are returned, there are no more movies.
      setHasMore(fetchedMovies.length === 20);
    } catch (err) {
      console.error('Error fetching movies:', err);
      setError('Failed to load movies. Please try again.');
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // Fetch movies when the component mounts or when the genre changes
  useEffect(() => {
    setPage(1); // Reset page to 1 when genre changes
    fetchMovies(selectedGenre, 1, true); // Reset movies list when genre changes
  }, [selectedGenre]);

  // Fetch more movies when the page number changes (except on genre change)
  useEffect(() => {
    if (page > 1) {
      fetchMovies(selectedGenre, page);
    }
  }, [page]);

  const handleViewMore = () => {
    setPage((prev) => prev + 1);
  };

  return (
    <div className="movies-page">
      <h2>{selectedGenre ? 'Movies by Genre' : 'All Movies'}</h2>
      {error && <p className="error">{error}</p>}
      <div className="movie-grid">
        {movies.map((movie) => (
          <NavLink
            key={movie.id}
            to={`/movie/${movie.id}`}
            className="movie-card"
          >
            <MovieCard movie={movie} />
          </NavLink>
        ))}
      </div>
      {loading && <p className="loading">Loading...</p>}
      {hasMore && !loading && (
        <button className="view-more-button" onClick={handleViewMore}>
          View More
        </button>
      )}
      {!hasMore && !loading && movies.length > 0 && (
        <p className="no-more">No more movies to load.</p>
      )}
    </div>
  );
}

export default MoviesPage;