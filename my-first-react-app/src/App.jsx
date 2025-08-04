import Search from './components/Search';
import { useState, useEffect } from 'react';
import { useDebounce } from 'react-use';
import Spinner from './components/Spinner';
import MovieCard from './components/MovieCard';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
};


function App() {

  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useDebounce(() => {
    setDebouncedSearchTerm(searchTerm);
  }, 500, [searchTerm]);

  const fetchMovies = async (query="") => {
    try {
      const endpoint = query == ""?

      `${API_BASE_URL}/discover/movie?sort_by=popularity.desc` :
      `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`; 


      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();


      // Show the movie titles here as a list
      setMovies(data.results || []);
      setLoading(false);
      
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);


  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
  
          <img src="./hero.png" alt="Hero" />
          <h1>Enjoy Popular <span className='text-gradient'>Movies</span> without the Hassle</h1>
        </header>


        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>

        <div className="movies">
          // show the movies titles here as a list
          <h2>Popular Movies</h2>
          {loading ? (
            <p><Spinner /></p>
          ) : (
            <div className="all-movies">
              <ul>
                {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
                ))}
              </ul>
            </div>
          )}


        </div>
      
      </div>
    

    </main>
  );
}

export default App;



