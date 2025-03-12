import React from 'react';

function MovieCard({ movie }) {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
    : 'https://via.placeholder.com/200x300?text=No+Poster';

  return (
    <div style={{
      border: '1px solid #ccc',
      borderRadius: '5px',
      padding: '10px',
      margin: '10px',
      width: '250px',
      display: 'inline-block',
      verticalAlign: 'top',
    }}>
      <img
        src={posterUrl}
        alt={movie.title}
        style={{ width: '100%', height: 'auto' }}
      />
      <h3 style={{ fontSize: '16px', margin: '10px 0' }}>{movie.title}</h3>
      <p style={{ fontSize: '14px', color: '#666' }}>
        Release: {movie.release_date || 'N/A'}
      </p>
      <p style={{ fontSize: '12px' }}>
        {movie.overview.length > 100
          ? `${movie.overview.substring(0, 100)}...`
          : movie.overview}
      </p>
    </div>
  );
}

export default MovieCard;