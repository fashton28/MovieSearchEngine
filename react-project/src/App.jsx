import React, { useState, useEffect } from 'react'
import Search from './components/search.jsx'
import Spinner from './components/spinner.jsx'
import Card from './components/card.jsx'
import {useDebounce} from 'react-use' //Won't use | SetTimeout seems more effective
import { Client, Account, Databases } from 'appwrite';
import { getTrendingMovies, updateSearchCount } from './appwrite.js'


const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMovie = async (query = '') => {
    setIsLoading(true);
    try {
      const endpoint = query 
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`
        : `${API_BASE_URL}/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc`;
      
      const response = await fetch(endpoint, API_OPTIONS);
      const data = await response.json();
      setMovieList(data.results || []);
      


      if(query && data.results.length > 0){
        await updateSearchCount(query, data.results[0]);
      }


    } catch(error) {
      console.error(`Error fetching movies: ${error}`);
      setMovieList([]);
    } finally {
      setIsLoading(false);
    }
  }

  const loadTrendingMovies = async() => {
    try{
        const movies = await getTrendingMovies();
        setTrendingMovies(movies);
    }catch(error) {
        console.log(error);
    }
  }

  useEffect(() => {
    // Implementation of a debounceTimer in order to optimize API requests
    const debounceTimer = setTimeout(() => {
      fetchMovie(searchTerm);
    }, 600);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
    <main>
        <div className='pattern'/>

        <div className='wrapper'>
            <header>
                <img src="../public/hero.png" alt="" />
                <h1>Find <span className='text-gradient'>Movies</span> You'll Enjoy Without the Hassle</h1>
                <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
            </header>
            {trendingMovies.length > 0 && (
              <section className='trending'>
                <h2>Trending Movies</h2>
                <ul>
                  {trendingMovies.map((movie, index) => (
                    <li key={movie.$id}>
                      <p>{index + 1}</p>
                      <img src ={movie.poster_url} alt={movie.title}/>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            <section className='all-movies'>
                <h2>All Movies</h2>
                {isLoading 
                  ? (
                    <div className='text-white'>
                      <Spinner/>
                    </div>
                  ) 
                  : movieList.length === 0 ? (
                    <p className='text-white'>
                      No movies found
                    </p>
                  ) : (
                    <ul>
                      {movieList.map((movie) => (
                        <Card 
                          key={movie.id}
                          title={movie.title}
                          poster_path={movie.poster_path}
                          vote_average={movie.vote_average}
                          original_language={movie.original_language}
                          release_date={movie.release_date}
                        />
                      ))}
                    </ul>
                  )
                }
            </section>
        </div>
    </main>
  )
}

