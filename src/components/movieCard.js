import React from 'react';
import { Link } from 'react-router-dom';

function MovieCard({ movie }) {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
    : 'https://via.placeholder.com/200x300?text=No+Poster';

  const releaseDate = movie.release_date || 'N/A';
  const overview = movie.overview || 'No description available.';

  return (
    <div className="movie-card-container">
      <Link to={`/movie/${movie.id}`} className="movie-card-link">
        <img src={posterUrl} alt={movie.title} />
        <div className="movie-info">
          <h3>{movie.title}</h3>
          <p>Release: {releaseDate}</p>
          <p>{overview}</p>
        </div>
      </Link>
    </div>
  );
}

export default MovieCard;