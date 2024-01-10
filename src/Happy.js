import React, { useEffect, useState } from 'react';
import Nav from './Nav';
import axios from './axios';
import ReactPlayer from 'react-player/youtube';
import './Happy.css';
import './script.js'
import EmotionBanner from './EmotionBanner';
import { AiOutlineClose } from "react-icons/ai";

function Happy() {

  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState('');
  const [isTrailerOpen, setIsTrailerOpen] = useState(false); // New state variable

  const base_url = "https://image.tmdb.org/t/p/original/";

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          'https://api.themoviedb.org/3/list/8258265',
          {
            params: {
              api_key: 'f81980ff410e46f422d64ddf3a56dddd',
            },
          }
        );

        setMovies(response.data.items);
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();

  }, []);
  console.log(movies)

  const handleTrailerClick = async (movie) => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${movie.id}/videos`,
        {
          params: {
            api_key: 'f81980ff410e46f422d64ddf3a56dddd',
          },
        }
      );
  
      console.log(response);
      const trailers = response.data.results;
      const youtubeTrailer = trailers.find(
        (trailer) => trailer.site === 'YouTube' && (trailer.type === 'Trailer' || trailer.type === 'Teaser')
      );

      if (youtubeTrailer) {
        const videoId = youtubeTrailer.key;
        setTrailerUrl(videoId);
        setIsTrailerOpen(true); // Open the trailer
      } else {
        setTrailerUrl('');
        console.log('Trailer not found');
      }
    } catch (error) {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/tv/${movie.id}/videos`,
          {
            params: {
              api_key: 'f81980ff410e46f422d64ddf3a56dddd',
            },
          }
        );
  
        const trailers = response.data.results;
        const youtubeTrailer = trailers.find(
          (trailer) => trailer.site === 'YouTube' && (trailer.type === 'Trailer' || trailer.type === 'Teaser')
        );

        if (youtubeTrailer) {
          const videoId = youtubeTrailer.key;
          setTrailerUrl(videoId);
          setIsTrailerOpen(true); // Open the trailer
        } else {
          console.log('Trailer not found');
        }
      } catch (error) {
        throw new Error(error);
      }
    }
  };
  
  const handleTrailerClose = () => {
    setTrailerUrl('');
    setIsTrailerOpen(false); // Close the trailer
  };

  const opts = {
    height: '500px',
    width: '800px',
    playerVars: {
      autoplay: 1,
    },
  };

  return (
    <div className='row'>
      <Nav />
      <EmotionBanner />
      <div className='header'>
        <h3 className='title'>Happy Movies</h3>
        <div className='progress-bar'></div>
      </div>
        <div className='container'>
          <button className='handle left-handle'>
            <div className='text'>&#8249;</div>
          </button>
            <div className='slider'>
              {movies.map((movie) => ( 
                  <img
                    className='movie_poster'
                    onClick={() => handleTrailerClick(movie)}
                    key={movie.id}
                    src={`${base_url}${movie.backdrop_path}`}
                    alt={movie.name}
                  />
                  
                ))}
            </div>
            <button className='handle right-handle'>
              <div className='text'>&#8250;</div>
            </button>
      </div>

      {isTrailerOpen && trailerUrl && ( // Show the trailer wrapper only when the trailer is open
        <div className='trailer-wrapper'>
          <button className='close-button' onClick={handleTrailerClose}> <AiOutlineClose /> </button>
          <div className='trailer'>
            <ReactPlayer
            url={`https://www.youtube.com/watch?v=${trailerUrl}`}
            width={opts.width}
            height={opts.height}
            controls
            playing
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Happy;
