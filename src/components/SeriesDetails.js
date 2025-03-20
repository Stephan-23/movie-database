import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSeriesDetails, getSeriesVideos } from '../api';

function SeriesDetails() {
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSeriesDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const seriesData = await getSeriesDetails(id);
        setShow(seriesData);

        // Fetch trailer
        const videos = await getSeriesVideos(id);
        const trailer = videos.find(
          (video) =>
            (video.type === 'Trailer' || video.type === 'Teaser') &&
            video.site === 'YouTube'
        );
        setTrailerKey(trailer ? trailer.key : null);
      } catch (error) {
        console.error('Error fetching series details:', error);
        setError('Failed to load series details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchSeriesDetails();
  }, [id]);

  if (loading) {
    return <p className="loading">Loading...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (!show) {
    return <p className="error">Series not found!</p>;
  }

  const posterUrl = show.poster_path
    ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Poster';

  const backdropUrl = show.backdrop_path
    ? `https://image.tmdb.org/t/p/original${show.backdrop_path}`
    : null;

  const handlePlayTrailer = () => {
    if (trailerKey) {
      setShowTrailer(true);
    } else {
      alert('No trailer available for this series.');
    }
  };

  const handleStopTrailer = () => {
    setShowTrailer(false);
  };

  return (
    <div
      className="movie-details"
      style={{
        backgroundImage: backdropUrl
          ? `url(${backdropUrl})`
          : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Link to="/series" className="back-link">
        ← Back to Series
      </Link>
      <div className="movie-details-container">
        <div className="movie-poster">
          {!showTrailer ? (
            <>
              <img src={posterUrl} alt={show.name} />
              {trailerKey && (
                <button className="play-button" onClick={handlePlayTrailer}>
                  ▶
                </button>
              )}
            </>
          ) : (
            <div className="trailer-player">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                title="Series Trailer"
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
          <h2>{show.name}</h2>
          <p>
            <strong>First Air Date:</strong> {show.first_air_date || 'N/A'}
          </p>
          <p>
            <strong>Rating:</strong> {show.vote_average}/10 ({show.vote_count} votes)
          </p>
          <p>
            <strong>Overview:</strong> {show.overview || 'No description available.'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default SeriesDetails;