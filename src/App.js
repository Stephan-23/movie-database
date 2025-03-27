import { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import SearchBar from './components/searchBar';
import MovieCard from './components/movieCard';
import MovieDetails from './components/movieDetails';
import MoviesPage from './components/MoviesPage';
import SeriesPage from './components/SeriesPage';
import SeriesDetails from './components/SeriesDetails';
import {
  getTrendingMovies,
  getTopRatedMovies,
  getTopRatedSeries,
  searchMovies,
  getMoviesByGenre,
  getSeriesByGenre,
  getMovieVideos,
} from './api';
import { auth, signInWithGoogle, logOut, addToWatchlist, removeFromWatchlist, getWatchlist } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import './App.css';

function App() {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [topRatedSeries, setTopRatedSeries] = useState([]);
  const [genreSeries, setGenreSeries] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [genreMovies, setGenreMovies] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
  const [trailerUrl, setTrailerUrl] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // State for hamburger menu
  const [user, setUser] = useState(null); // State to track logged-in user
  const [watchlist, setWatchlist] = useState([]); // State for watchlist
  const timerRef = useRef(null);

  // Monitor authentication state and fetch watchlist
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userWatchlist = await getWatchlist(currentUser.uid);
          setWatchlist(userWatchlist);
        } catch (error) {
          setError('Failed to fetch watchlist.');
        }
      } else {
        setWatchlist([]); // Clear watchlist on logout
      }
    });
    return () => unsubscribe();
  }, []);

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

    const fetchSeriesByGenre = async () => {
      if (selectedGenre) {
        setLoading(true);
        setError(null);
        try {
          const series = await getSeriesByGenre(selectedGenre);
          setGenreSeries(series);
        } catch (error) {
          console.error('Error fetching series by genre:', error);
          setError('No series found for this genre.');
          setGenreSeries([]);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchMoviesByGenre();
    fetchSeriesByGenre();
  }, [selectedGenre]);

  const featuredMovie = trendingMovies[currentMovieIndex] || {};
  useEffect(() => {
    const fetchTrailer = async () => {
      if (featuredMovie.id) {
        try {
          const videos = await getMovieVideos(featuredMovie.id);
          const trailer = videos.find(
            (video) => video.type === 'Trailer' || video.type === 'Teaser'
          );
          if (trailer && trailer.site === 'YouTube') {
            setTrailerUrl(`https://www.youtube.com/embed/${trailer.key}?autoplay=1`);
          } else {
            setTrailerUrl('');
          }
        } catch (error) {
          console.error('Error fetching trailer:', error);
          setTrailerUrl('');
        }
      }
    };
    fetchTrailer();
  }, [featuredMovie.id]);

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

  const handleWatchTrailer = () => {
    if (trailerUrl) {
      setShowModal(true);
    } else {
      alert('No trailer available for this movie.');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setTrailerUrl('');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Handle login and logout
  const handleLogin = async () => {
    try {
      await signInWithGoogle();
      setMenuOpen(false); // Close menu after login
    } catch (error) {
      console.error('Error signing in:', error);
      setError('Failed to sign in. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await logOut();
      setMenuOpen(false); // Close menu after logout
    } catch (error) {
      console.error('Error signing out:', error);
      setError('Failed to sign out. Please try again.');
    }
  };

  // Add/Remove from Watchlist
  const handleAddToWatchlist = async (item) => {
    if (!user) {
      alert('Please log in to add to your watchlist.');
      return;
    }
    try {
      await addToWatchlist(user.uid, item);
      setWatchlist([...watchlist, item]);
    } catch (error) {
      setError('Failed to add to watchlist.');
    }
  };

  const handleRemoveFromWatchlist = async (item) => {
    try {
      await removeFromWatchlist(user.uid, item);
      setWatchlist(watchlist.filter((watchlistItem) => watchlistItem.id !== item.id));
    } catch (error) {
      setError('Failed to remove from watchlist.');
    }
  };

  return (
    <Router>
      <div className="app-container">
        <header className="header">
          <NavLink to="/" className="logo">
            TDMovies
          </NavLink>
          <button className="hamburger" onClick={toggleMenu}>
            ☰
          </button>
          <nav className={menuOpen ? 'active' : ''}>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              onClick={toggleMenu}
            >
              Home
            </NavLink>
            <NavLink
              to="/movies"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              onClick={toggleMenu}
            >
              Movies
            </NavLink>
            <NavLink
              to="/series"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              onClick={toggleMenu}
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
                    onClick={() => {
                      handleGenreChange(genre.id);
                      toggleMenu();
                    }}
                  >
                    {genre.name}
                  </div>
                ))}
              </div>
            </div>
            <div className="auth-section">
              {user ? (
                <>
                  <span className="user-name">Hello, {user.displayName}</span>
                  <button className="auth-button" onClick={handleLogout}>
                    Logout
                  </button>
                </>
              ) : (
                <button className="auth-button" onClick={handleLogin}>
                  Login with Google
                </button>
              )}
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
                        {user && (
                          watchlist.some((item) => item.id === featuredMovie.id) ? (
                            <button
                              className="watchlist-button"
                              onClick={() => handleRemoveFromWatchlist(featuredMovie)}
                            >
                              Remove from Watchlist
                            </button>
                          ) : (
                            <button
                              className="watchlist-button"
                              onClick={() => handleAddToWatchlist(featuredMovie)}
                            >
                              Add to Watchlist
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {showModal && (
                  <div className="modal">
                    <div className="modal-content">
                      <span className="close-modal" onClick={closeModal}>
                        ×
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

                {/* Watchlist Section */}
                {user && watchlist.length > 0 && (
                  <section className="section">
                    <h2>Your Watchlist</h2>
                    <div className="movie-list">
                      {watchlist.map((item) => (
                        <div key={item.id} className="movie-card-container">
                          <NavLink
                            to={item.media_type === 'tv' ? `/series/${item.id}` : `/movie/${item.id}`}
                            className="movie-card"
                          >
                            <MovieCard movie={item} />
                          </NavLink>
                          <button
                            className="watchlist-remove-button"
                            onClick={() => handleRemoveFromWatchlist(item)}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {searchResults.length > 0 && (
                  <section className="section">
                    <h2>Search Results</h2>
                    <div className="movie-list">
                      {searchResults.map((item) => (
                        <div key={item.id} className="movie-card-container">
                          <NavLink to={`/movie/${item.id}`} className="movie-card">
                            <MovieCard movie={item} />
                          </NavLink>
                          {user && (
                            watchlist.some((watchlistItem) => watchlistItem.id === item.id) ? (
                              <button
                                className="watchlist-remove-button"
                                onClick={() => handleRemoveFromWatchlist(item)}
                              >
                                Remove
                              </button>
                            ) : (
                              <button
                                className="watchlist-button"
                                onClick={() => handleAddToWatchlist(item)}
                              >
                                Add to Watchlist
                              </button>
                            )
                          )}
                        </div>
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
                        <div key={movie.id} className="movie-card-container">
                          <NavLink to={`/movie/${movie.id}`} className="movie-card">
                            <MovieCard movie={movie} />
                          </NavLink>
                          {user && (
                            watchlist.some((item) => item.id === movie.id) ? (
                              <button
                                className="watchlist-remove-button"
                                onClick={() => handleRemoveFromWatchlist(movie)}
                              >
                                Remove
                              </button>
                            ) : (
                              <button
                                className="watchlist-button"
                                onClick={() => handleAddToWatchlist(movie)}
                              >
                                Add to Watchlist
                              </button>
                            )
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                <section className="section">
                  <h2>Trending movies</h2>
                  <div className="movie-list">
                    {trendingMovies.map((movie) => (
                      <div key={movie.id} className="movie-card-container">
                        <NavLink to={`/movie/${movie.id}`} className="movie-card">
                          <MovieCard movie={movie} />
                        </NavLink>
                        {user && (
                          watchlist.some((item) => item.id === movie.id) ? (
                            <button
                              className="watchlist-remove-button"
                              onClick={() => handleRemoveFromWatchlist(movie)}
                            >
                              Remove
                            </button>
                          ) : (
                            <button
                              className="watchlist-button"
                              onClick={() => handleAddToWatchlist(movie)}
                            >
                              Add to Watchlist
                            </button>
                          )
                        )}
                      </div>
                    ))}
                  </div>
                </section>

                <section className="section">
                  <h2>Top rated movies</h2>
                  <div className="movie-list">
                    {topRatedMovies.map((movie) => (
                      <div key={movie.id} className="movie-card-container">
                        <NavLink to={`/movie/${movie.id}`} className="movie-card">
                          <MovieCard movie={movie} />
                        </NavLink>
                        {user && (
                          watchlist.some((item) => item.id === movie.id) ? (
                            <button
                              className="watchlist-remove-button"
                              onClick={() => handleRemoveFromWatchlist(movie)}
                            >
                              Remove
                            </button>
                          ) : (
                            <button
                              className="watchlist-button"
                              onClick={() => handleAddToWatchlist(movie)}
                            >
                              Add to Watchlist
                            </button>
                          )
                        )}
                      </div>
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
                      <div key={series.id} className="movie-card-container">
                        <NavLink to={`/series/${series.id}`} className="movie-card">
                          <MovieCard movie={{ ...series, media_type: 'tv' }} />
                        </NavLink>
                        {user && (
                          watchlist.some((item) => item.id === series.id) ? (
                            <button
                              className="watchlist-remove-button"
                              onClick={() => handleRemoveFromWatchlist(series)}
                            >
                              Remove
                            </button>
                          ) : (
                            <button
                              className="watchlist-button"
                              onClick={() => handleAddToWatchlist({ ...series, media_type: 'tv' })}
                            >
                              Add to Watchlist
                            </button>
                          )
                        )}
                      </div>
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
          <Route path="/series/:id" element={<SeriesDetails />} />
          <Route
            path="/movies"
            element={<MoviesPage selectedGenre={selectedGenre} />}
          />
          <Route
            path="/series"
            element={<SeriesPage selectedGenre={selectedGenre} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;