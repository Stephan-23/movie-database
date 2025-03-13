import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SearchBar from './components/searchBar';
import MovieCard from './components/movieCard';
import MovieDetails from './components/movieDetails';
import {
  getTrendingMovies,
  getTopRatedMovies,
  getTopRatedSeries,
  searchMovies,
} from './api';
import './App.css';

function App() {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [topRatedSeries, setTopRatedSeries] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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

  // Define 10 genres (these are common TMDb genre IDs and names)
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

  const handleGenreChange = (event) => {
    const genreId = event.target.value;
    // Placeholder: This would trigger a genre-specific fetch (to be implemented later)
    console.log('Selected genre ID:', genreId);
  };

  // Use the first trending movie for the hero section
  const featuredMovie = trendingMovies[0] || {};

  return (
    <Router>
      <div className="app-container">
        <header className="header">
          <Link to="/" className="logo">
            tMovies
          </Link>
          <nav>
            <Link to="/" className="nav-link active">
              Home
            </Link>
            <Link to="/movies" className="nav-link">
              Movies
            </Link>
            <Link to="/series" className="nav-link">
              TV Series
            </Link>
            <select
              onChange={handleGenreChange}
              className="genre-dropdown"
              defaultValue=""
            >
              <option value="" disabled>
                Select Genre
              </option>
              {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
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
                  >
                    <div className="hero-content">
                      <h1>{featuredMovie.title}</h1>
                      <p>{featuredMovie.overview}</p>
                      <div className="hero-buttons">
                        <button className="watch-trailer">Watch trailer</button>
                        <button className="watch-now">Watch now</button>
                      </div>
                    </div>
                  </div>
                )}

                {searchResults.length > 0 && (
                  <section className="section">
                    <h2>Search Results</h2>
                    <div className="movie-list">
                      {searchResults.map((item) => (
                        <Link
                          key={item.id}
                          to={`/movie/${item.id}`}
                          className="movie-card"
                        >
                          <MovieCard movie={item} />
                        </Link>
                      ))}
                    </div>
                  </section>
                )}

                <section className="section">
                  <h2>Trending movies</h2>
                  <div className="movie-list">
                    {trendingMovies.map((movie) => (
                      <Link
                        key={movie.id}
                        to={`/movie/${movie.id}`}
                        className="movie-card"
                      >
                        <MovieCard movie={movie} />
                      </Link>
                    ))}
                  </div>
                </section>

                <section className="section">
                  <h2>Top rated movies</h2>
                  <div className="movie-list">
                    {topRatedMovies.map((movie) => (
                      <Link
                        key={movie.id}
                        to={`/movie/${movie.id}`}
                        className="movie-card"
                      >
                        <MovieCard movie={movie} />
                      </Link>
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
                      <Link
                        key={series.id}
                        to={`/series/${series.id}`} // Placeholder route
                        className="movie-card"
                      >
                        <MovieCard movie={series} />
                      </Link>
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
                movies={[...trendingMovies, ...topRatedMovies]}
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