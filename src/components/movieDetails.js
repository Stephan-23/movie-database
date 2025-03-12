import React from 'react';
import { useParams, Link } from 'react-router-dom';

function MovieDetails({ movies }) {
  const { id } = useParams();
  const movie = movies.find((m) => m.id === Number(id));

  if (!movie) {
    return <p className="error">Movie not found!</p>;
  }

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Poster';

  return (
    <div className="movie-details">
      <Link to="/" style={{ textDecoration: 'none', color: '#007bff' }}>
        ← Back to Search
      </Link>
      <h2>{movie.title}</h2>
      <img src={posterUrl} alt={movie.title} />
      <p><strong>Release Date:</strong> {movie.release_date || 'N/A'}</p>
      <p><strong>Rating:</strong> {movie.vote_average}/10 ({movie.vote_count} votes)</p>
      <p><strong>Overview:</strong> {movie.overview}</p>
    </div>
  );
}

export default MovieDetails;