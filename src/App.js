import { useEffect } from 'react';
import { searchMovies } from './api';

function App() {
  useEffect(() => {
    const testApi = async () => {
      try {
        const movies = await searchMovies('Avengers');
        console.log(movies);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };
    testApi();
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div>
      <h1>Movie Database</h1>
    </div>
  );
}

export default App;