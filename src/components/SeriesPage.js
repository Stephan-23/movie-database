import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import MovieCard from './movieCard';
import { getTopRatedSeries, getSeriesByGenre } from '../api';

function SeriesPage({ selectedGenre }) {
  const [series, setSeries] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchSeries = async (genreId, pageNum, reset = false) => {
    setLoading(true);
    setError(null);
    try {
      let fetchedSeries;
      if (genreId) {
        fetchedSeries = await getSeriesByGenre(genreId, pageNum);
      } else {
        fetchedSeries = await getTopRatedSeries(pageNum);
      }

      if (reset) {
        setSeries(fetchedSeries);
      } else {
        setSeries((prev) => [...prev, ...fetchedSeries]);
      }

      // TMDb API typically returns 20 items per page. If fewer than 20 are returned, there are no more items.
      setHasMore(fetchedSeries.length === 20);
    } catch (err) {
      console.error('Error fetching series:', err);
      setError('Failed to load TV series. Please try again.');
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // Fetch series when the component mounts or when the genre changes
  useEffect(() => {
    setPage(1); // Reset page to 1 when genre changes
    fetchSeries(selectedGenre, 1, true); // Reset series list when genre changes
  }, [selectedGenre]);

  // Fetch more series when the page number changes (except on genre change)
  useEffect(() => {
    if (page > 1) {
      fetchSeries(selectedGenre, page);
    }
  }, [page]);

  const handleViewMore = () => {
    setPage((prev) => prev + 1);
  };

  return (
    <div className="series-page">
      <h2>{selectedGenre ? 'TV Series by Genre' : 'All TV Series'}</h2>
      {error && <p className="error">{error}</p>}
      <div className="series-grid">
        {series.map((show) => (
          <NavLink
            key={show.id}
            to={`/series/${show.id}`}
            className="series-card"
          >
            <MovieCard movie={show} />
          </NavLink>
        ))}
      </div>
      {loading && <p className="loading">Loading...</p>}
      {hasMore && !loading && (
        <button className="view-more-button" onClick={handleViewMore}>
          View More
        </button>
      )}
      {!hasMore && !loading && series.length > 0 && (
        <p className="no-more">No more TV series to load.</p>
      )}
    </div>
  );
}

export default SeriesPage;