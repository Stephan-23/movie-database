import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMovieDetails, getMovieVideos } from '../api';


function MovieDetails({
  user,
  watchlist,
  handleAddToWatchlist,
  handleRemoveFromWatchlist,
  movies,
}) {
  const { id } = useParams();
  const movie = movies ? movies.find((m) => m.id === Number(id)) : null;

  const [trailerKey, setTrailerKey] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setLoading(true);
      setError(null);

      if (!movie) return;

      try {
        const videos = await getMovieVideos(movie.id);
        const trailer = videos.find(
          (video) =>
            (video.type === 'Trailer' || video.type === 'Teaser') &&
            video.site === 'YouTube'
        );
        setTrailerKey(trailer ? trailer.key : null);
      } catch (error) {
        console.error('Error fetching movie details:', error);
        setError('Failed to load movie details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movie]);

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!movie) return <p className="error">Movie not found!</p>;

  const isInWatchlist = watchlist.some((item) => item.id === movie.id);

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Poster';

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;

  const handlePlayTrailer = () => {
    if (trailerKey) {
      setShowTrailer(true);
    } else {
      alert('No trailer available for this movie.');
    }
  };

  const handleStopTrailer = () => {
    setShowTrailer(false);
  };

  return (
    <div
      className="movie-details"
      style={{
        backgroundImage: backdropUrl ? `url(${backdropUrl})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Link to="/" className="back-link">
        ← Back to Home
      </Link>
      <div className="movie-details-container">
        <div className="movie-poster">
          {!showTrailer ? (
            <>
              <img src={posterUrl} alt={movie.title} />
              {trailerKey && (
                <button className="play-button" onClick={handlePlayTrailer}>
                  ▶
                </button>
              )}
              {/* Add Watchlist Button Below Poster */}
              {user && (
                <button
                  className={isInWatchlist ? 'watchlist-remove-button' : 'watchlist-button'}
                  onClick={() =>
                    isInWatchlist
                      ? handleRemoveFromWatchlist(movie)
                      : handleAddToWatchlist(movie)
                  }
                >
                  {isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
                </button>
              )}
            </>
          ) : (
            <div className="trailer-player">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                title="Movie Trailer"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              <button className="stop-button" onClick={handleStopTrailer}>
                ✕
              </button>
            </div>
          )}
        </div>
        <div className="movie-info-details">
          <h2>{movie.title}</h2>
          <p>
            <strong>Release Date:</strong> {movie.release_date || 'N/A'}
          </p>
          <p>
            <strong>Rating:</strong> {movie.vote_average}/10 ({movie.vote_count} votes)
          </p>
          <p>
            <strong>Overview:</strong> {movie.overview || 'No description available.'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
