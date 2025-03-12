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