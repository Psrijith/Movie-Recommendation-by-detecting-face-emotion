import React, { useState, useEffect } from 'react';
import axios from './axios';
import './Banner.css';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import ReactPlayer from 'react-player/youtube';
import { AiOutlineClose } from "react-icons/ai";

function EmotionBanner() {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState('');
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('https://api.themoviedb.org/3/list/8258265', {
          params: {
            api_key: 'f81980ff410e46f422d64ddf3a56dddd',
          },
        });

        setMovies(response.data.items);
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, []);

  function truncate(string, n) {
    if (string && string.length > n) {
      return string.substring(0, n - 1) + '...';
    } else {
      return string;
    }
  }

  const handleTrailerClick = async (movie) => {
    try {
      const response = await axios.get(
        `/movie/${movie.id}/videos?api_key=f81980ff410e46f422d64ddf3a56dddd`
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
          `/tv/${movie.id}/videos?api_key=f81980ff410e46f422d64ddf3a56dddd`
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

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 1,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  return (
    <>
      {isTrailerOpen && trailerUrl && (
        <div className='trailer-wrapper'>
          <button className='close-button' onClick={handleTrailerClose}>
            <AiOutlineClose />
          </button>
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

      <Carousel
        responsive={responsive}
        autoPlay={!isTrailerOpen} // Autoplay only when the trailer is not open
        infinite
        slidesToSlide={1}
      >
        {movies.map((movie) => (
          <div
            key={movie.id}
            className='banner'
            style={{
              backgroundSize: 'cover',
              backgroundImage: movie && movie.backdrop_path ? `url(https://image.tmdb.org/t/p/original/${movie.backdrop_path})` : '',
              backgroundPosition: 'center center',
            }}
          >
            <div className='banner__contents'>
              <h1 className='banner__title'>
                {movie && (movie.name || movie.title || movie.original_name)}
              </h1>
              <div className='banner__buttons'>
                <button className='banner__button' onClick={() => handleTrailerClick(movie)}>Play</button>
                <button className='banner__button'>My List</button>
              </div>
              <h1 className='banner__description'>{truncate(movie.overview, 150)}</h1>
            </div>
            <div className='banner--fadebottom' />
          </div>
        ))}
      </Carousel>
    </>
  );
}

export default EmotionBanner;
