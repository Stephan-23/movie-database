import axios from 'axios';

const API_KEY = 'e7b8ca8a60f50f2082f8e470c7d7b0e4';
const BASE_URL = 'https://api.themoviedb.org/3';

export const searchMovies = async (query) => {
  const response = await axios.get(`${BASE_URL}/search/movie`, {
    params: {
      api_key: API_KEY,
      query: query,
    },
  });
  return response.data.results;
};

export const getTopRatedMovies = async () => {
  const response = await axios.get(`${BASE_URL}/movie/top_rated`, {
    params: {
      api_key: API_KEY,
    },
  });
  return response.data.results;
};

// Fetch trending movies with pagination
export const getTrendingMovies = async (page = 1) => {
  const response = await axios.get(`${BASE_URL}/trending/movie/week`, {
    params: {
      api_key: API_KEY,
      page: page,
    },
  });
  return response.data.results;
};

// Fetch top-rated TV shows with pagination
export const getTopRatedSeries = async (page = 1) => {
  const response = await axios.get(`${BASE_URL}/tv/top_rated`, {
    params: {
      api_key: API_KEY,
      page: page,
    },
  });
  return response.data.results;
};

// Fetch movies by genre with pagination
export const getMoviesByGenre = async (genreId, page = 1) => {
  const response = await axios.get(`${BASE_URL}/discover/movie`, {
    params: {
      api_key: API_KEY,
      with_genres: genreId,
      page: page,
    },
  });
  return response.data.results;
};

// Fetch TV series by genre with pagination
export const getSeriesByGenre = async (genreId, page = 1) => {
  const response = await axios.get(`${BASE_URL}/discover/tv`, {
    params: {
      api_key: API_KEY,
      with_genres: genreId,
      page: page,
    },
  });
  return response.data.results;
};

// Get movie trailer
export const getMovieVideos = async (movieId) => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/${movieId}/videos`, {
      params: {
        api_key: API_KEY,
        language: 'en-US',
      },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching movie videos:', error);
    throw error;
  }
};

// Get series trailer
export const getSeriesVideos = async (seriesId) => {
  try {
    const response = await axios.get(`${BASE_URL}/tv/${seriesId}/videos`, {
      params: {
        api_key: API_KEY,
        language: 'en-US',
      },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching series videos:', error);
    throw error;
  }
};

// Fetch series details by ID
export const getSeriesDetails = async (seriesId) => {
  try {
    const response = await axios.get(`${BASE_URL}/tv/${seriesId}`, {
      params: {
        api_key: API_KEY,
        language: 'en-US',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching series details:', error);
    throw error;
  }
};