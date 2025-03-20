import React from 'react';
import { Link } from 'react-router-dom';

function MovieCard({ movie }) {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
    : 'https://via.placeholder.com/200x300?text=No+Poster';

  // Use first_air_date for TV series, fallback to release_date for movies
  const releaseDate = movie.first_air_date || movie.release_date || 'N/A';
  const overview = movie.overview || 'No description available.';
  // Use name for TV series, fallback to title for movies
  const title = movie.name || movie.title;

  return (
    <div className="movie-card-container">
      <Link to={`/movie/${movie.id}`} className="movie-card-link">
        <img src={posterUrl} alt={title} />
        <div className="movie-info">
          <h3>{title}</h3>
          <p>Release: {releaseDate}</p>
          <p>{overview}</p>
        </div>
      </Link>
    </div>
  );
}

export default MovieCard;