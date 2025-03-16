import { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import SearchBar from './components/searchBar';
import MovieCard from './components/movieCard';
import MovieDetails from './components/movieDetails';
import {
  getTrendingMovies,
  getTopRatedMovies,
  getTopRatedSeries,
  searchMovies,
  getMoviesByGenre,
  getMovieVideos, // Import the new function
} from './api';
import './App.css';

function App() {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [topRatedSeries, setTopRatedSeries] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [genreMovies, setGenreMovies] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
  const [trailerUrl, setTrailerUrl] = useState(''); // State for trailer URL
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const timerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [trending, topRated, topRatedTv] = await Promise.all([
          getTrendingMovies(),
          getTopRatedMovies(),
          getTopRatedSeries(),
        ]);
        setTrendingMovies(trending);
        setTopRatedMovies(topRated);
        setTopRatedSeries(topRatedTv);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchMoviesByGenre = async () => {
      if (selectedGenre) {
        setLoading(true);
        setError(null);
        try {
          const movies = await getMoviesByGenre(selectedGenre);
          setGenreMovies(movies);
        } catch (error) {
          console.error('Error fetching movies by genre:', error);
          setError('No movies found for this genre.');
          setGenreMovies([]);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchMoviesByGenre();
  }, [selectedGenre]);

  // Fetch trailer for the featured movie
  const featuredMovie = trendingMovies[currentMovieIndex] || {};
  useEffect(() => {
    const fetchTrailer = async () => {
      if (featuredMovie.id) {
        try {
          const videos = await getMovieVideos(featuredMovie.id);
          // Find the first trailer or teaser
          const trailer = videos.find(
            (video) => video.type === 'Trailer' || video.type === 'Teaser'
          );
          if (trailer && trailer.site === 'YouTube') {
            setTrailerUrl(`https://www.youtube.com/embed/${trailer.key}?autoplay=1`);
          } else {
            setTrailerUrl(''); // No trailer found
          }
        } catch (error) {
          console.error('Error fetching trailer:', error);
          setTrailerUrl('');
        }
      }
    };
    fetchTrailer();
  }, [featuredMovie.id]); // Fetch trailer when featuredMovie changes

  const handleSearch = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const results = await searchMovies(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching:', error);
      setError('No results found. Please try again.');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const genres = [
    { id: 28, name: 'Action' },
    { id: 35, name: 'Comedy' },
    { id: 18, name: 'Drama' },
    { id: 27, name: 'Horror' },
    { id: 10751, name: 'Family' },
    { id: 878, name: 'Science Fiction' },
    { id: 53, name: 'Thriller' },
    { id: 16, name: 'Animation' },
    { id: 10749, name: 'Romance' },
    { id: 99, name: 'Documentary' },
  ];

  const handleGenreChange = (genreId) => {
    setSelectedGenre(genreId);
  };

  const nextMovie = () => {
    setCurrentMovieIndex((prev) =>
      prev + 1 < Math.min(6, trendingMovies.length) ? prev + 1 : 0
    );
    resetTimer();
  };

  const handleDragStart = (e) => {
    const startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    const handleDragMove = (moveEvent) => {
      const currentX =
        moveEvent.type === 'touchmove'
          ? moveEvent.touches[0].clientX
          : moveEvent.clientX;
      const diff = startX - currentX;
      if (diff > 50) {
        nextMovie();
        document.removeEventListener('mousemove', handleDragMove);
        document.removeEventListener('mouseup', handleDragEnd);
        document.removeEventListener('touchmove', handleDragMove);
        document.removeEventListener('touchend', handleDragEnd);
      }
    };
    const handleDragEnd = () => {
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
      document.removeEventListener('touchmove', handleDragMove);
      document.removeEventListener('touchend', handleDragEnd);
    };
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('touchmove', handleDragMove, { passive: true });
    document.addEventListener('touchend', handleDragEnd);
  };

  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(nextMovie, 8000);
  };

  useEffect(() => {
    resetTimer();
    return () => clearInterval(timerRef.current);
  }, [trendingMovies]);

  // Handle Watch Trailer button click
  const handleWatchTrailer = () => {
    if (trailerUrl) {
      setShowModal(true);
    } else {
      alert('No trailer available for this movie.');
    }
  };

  // Close the modal
  const closeModal = () => {
    setShowModal(false);
    setTrailerUrl(''); // Reset trailer URL to stop playback
  };

  return (
    <Router>
      <div className="app-container">
        <header className="header">
          <NavLink to="/" className="logo">
            StackMasters
          </NavLink>
          <nav>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              Home
            </NavLink>
            <NavLink
              to="/movies"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              Movies
            </NavLink>
            <NavLink
              to="/series"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              TV Series
            </NavLink>
            <div className="custom-dropdown">
              <span className="dropdown-trigger">Select Genre</span>
              <div className="dropdown-content">
                {genres.map((genre) => (
                  <div
                    key={genre.id}
                    className="dropdown-item"
                    onClick={() => handleGenreChange(genre.id)}
                  >
                    {genre.name}
                  </div>
                ))}
              </div>
            </div>
          </nav>
        </header>

        <Routes>
          <Route
            path="/"
            element={
              <>
                {loading && <p className="loading">Loading...</p>}
                {error && <p className="error">{error}</p>}
                <SearchBar onSearch={handleSearch} />
                {trendingMovies.length > 0 && (
                  <div
                    className="hero"
                    style={{
                      backgroundImage: featuredMovie.backdrop_path
                        ? `url(https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path})`
                        : 'none',
                    }}
                    onMouseDown={handleDragStart}
                    onTouchStart={handleDragStart}
                  >
                    <div className="hero-content">
                      <h1>{featuredMovie.title}</h1>
                      <p>{featuredMovie.overview}</p>
                      <div className="hero-buttons">
                        <button className="watch-trailer" onClick={handleWatchTrailer}>
                          Watch trailer
                        </button>
                        <button className="watch-now">Watch now</button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Modal for Trailer */}
                {showModal && (
                  <div className="modal">
                    <div className="modal-content">
                      <span className="close-modal" onClick={closeModal}>
                        &times;
                      </span>
                      {trailerUrl ? (
                        <iframe
                          width="100%"
                          height="400"
                          src={trailerUrl}
                          title="Movie Trailer"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      ) : (
                        <p>No trailer available.</p>
                      )}
                    </div>
                  </div>
                )}

                {searchResults.length > 0 && (
                  <section className="section">
                    <h2>Search Results</h2>
                    <div className="movie-list">
                      {searchResults.map((item) => (
                        <NavLink
                          key={item.id}
                          to={`/movie/${item.id}`}
                          className="movie-card"
                        >
                          <MovieCard movie={item} />
                        </NavLink>
                      ))}
                    </div>
                  </section>
                )}

                {genreMovies.length > 0 && (
                  <section className="section">
                    <h2>
                      {genres.find((g) => g.id === parseInt(selectedGenre))?.name} Movies
                    </h2>
                    <div className="movie-list">
                      {genreMovies.map((movie) => (
                        <NavLink
                          key={movie.id}
                          to={`/movie/${movie.id}`}
                          className="movie-card"
                        >
                          <MovieCard movie={movie} />
                        </NavLink>
                      ))}
                    </div>
                  </section>
                )}

                <section className="section">
                  <h2>Trending movies</h2>
                  <div className="movie-list">
                    {trendingMovies.map((movie) => (
                      <NavLink
                        key={movie.id}
                        to={`/movie/${movie.id}`}
                        className="movie-card"
                      >
                        <MovieCard movie={movie} />
                      </NavLink>
                    ))}
                  </div>
                </section>

                <section className="section">
                  <h2>Top rated movies</h2>
                  <div className="movie-list">
                    {topRatedMovies.map((movie) => (
                      <NavLink
                        key={movie.id}
                        to={`/movie/${movie.id}`}
                        className="movie-card"
                      >
                        <MovieCard movie={movie} />
                      </NavLink>
                    ))}
                  </div>
                  <a href="#" className="view-all">
                    View all
                  </a>
                </section>

                <section className="section">
                  <h2>Top rated series</h2>
                  <div className="movie-list">
                    {topRatedSeries.map((series) => (
                      <NavLink
                        key={series.id}
                        to={`/series/${series.id}`}
                        className="movie-card"
                      >
                        <MovieCard movie={series} />
                      </NavLink>
                    ))}
                  </div>
                  <a href="#" className="view-all">
                    View all
                  </a>
                </section>
              </>
            }
          />
          <Route
            path="/movie/:id"
            element={
              <MovieDetails
                movies={[...trendingMovies, ...topRatedMovies, ...genreMovies]}
              />
            }
          />
          <Route path="/series/:id" element={<div>Series Details (Coming Soon)</div>} />
          <Route path="/movies" element={<div>Movies Page (Coming Soon)</div>} />
          <Route path="/series" element={<div>TV Series Page (Coming Soon)</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;