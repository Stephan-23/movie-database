import axios from 'axios';

const API_KEY = 'e7b8ca8a60f50f2082f8e470c7d7b0e4'; // Your TMDb API key
const BASE_URL = 'https://api.themoviedb.org/3';

export const searchMovies = async (query) => {
  try {
    const response = await axios.get(`${BASE_URL}/search/movie`, {
      params: {
        api_key: API_KEY,
        query: query,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

// Fetch trending movies
export const getTrendingMovies = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/trending/movie/week`, {
      params: {
        api_key: API_KEY,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    throw error;
  }
};

// Fetch top-rated movies
export const getTopRatedMovies = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/top_rated`, {
      params: {
        api_key: API_KEY,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching top-rated movies:', error);
    throw error;
  }
};

// Fetch top-rated TV series
export const getTopRatedSeries = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/tv/top_rated`, {
      params: {
        api_key: API_KEY,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching top-rated series:', error);
    throw error;
  }
};

// Fetch movies by genre
export const getMoviesByGenre = async (genreId) => {
  try {
    const response = await axios.get(`${BASE_URL}/discover/movie`, {
      params: {
        api_key: API_KEY,
        with_genres: genreId,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching movies by genre:', error);
    throw error;
  }
};

// Fetch movie videos (trailers)
export const getMovieVideos = async (movieId) => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/${movieId}/videos`, {
      params: {
        api_key: API_KEY,
        language: 'en-US',
      },
    });
    return response.data.results; // Returns an array of videos (trailers, teasers, etc.)
  } catch (error) {
    console.error('Error fetching movie videos:', error);
    throw error; // Re-throw the error to be handled by the caller
  }
};