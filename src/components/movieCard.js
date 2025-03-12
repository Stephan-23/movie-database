import React from 'react';

function MovieCard({ movie }) {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
    : 'https://via.placeholder.com/200x300?text=No+Poster';

  return (
    <div>
      <img src={posterUrl} alt={movie.title} />
      <h3>{movie.title}</h3>
      <p>Release: {movie.release_date || 'N/A'}</p>
      <p>
        {movie.overview.length > 100
          ? `${movie.overview.substring(0, 100)}...`
          : movie.overview}
      </p>
    </div>
  );
}

export default MovieCard;