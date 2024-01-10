import React, { useEffect, useState } from 'react';
import './Row.css';
import axios from './axios';
import ReactPlayer from 'react-player/youtube';
import { AiOutlineClose } from 'react-icons/ai';

function Row({ title, fetchUrl, isLargeRow = false }) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState('');
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const base_url = 'https://image.tmdb.org/t/p/original/';

  useEffect(() => {
    async function fetchData() {
      try {
        const request = await axios.get(fetchUrl);
        setMovies(request.data.results);
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, [fetchUrl]);

  const handleTrailerClick = async (movie) => {
    setSelectedMovie(movie)
    try {
      const response = await axios.get(`/movie/${movie.id}/videos?api_key=f81980ff410e46f422d64ddf3a56dddd`);
      console.log(response);
      const trailers = response.data.results;
      const youtubeTrailer = trailers.find(
        (trailer) => trailer.site === 'YouTube' && (trailer.type === 'Trailer' || trailer.type === 'Teaser')
      );

      if (youtubeTrailer) {
        const videoId = youtubeTrailer.key;
        setTrailerUrl(videoId);
        setIsTrailerOpen(true);
      } else {
        setTrailerUrl('');
        console.log('Trailer not found');
      }
    } catch (error) {
      try {
        const response = await axios.get(`/tv/${movie.id}/videos?api_key=f81980ff410e46f422d64ddf3a56dddd`);
        const trailers = response.data.results;
        const youtubeTrailer = trailers.find(
          (trailer) => trailer.site === 'YouTube' && (trailer.type === 'Trailer' || trailer.type === 'Teaser')
        );

        if (youtubeTrailer) {
          const videoId = youtubeTrailer.key;
          setTrailerUrl(videoId);
          setIsTrailerOpen(true);
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
    setIsTrailerOpen(false);
  };

  const opts = {
    height: '500px',
    width: '800px',
    playerVars: {
      autoplay: 1,
    },
  };

  return (
    <div className="row">
      <h2>{title}</h2>

      <div className="row__posters">
        {movies.map((movie) => (
          (isLargeRow && movie.poster_path) || (!isLargeRow && movie.backdrop_path)) && (
            <img
              className={`row__poster ${isLargeRow && "row__posterLarge"}`}
              onClick={() => handleTrailerClick(movie)}
              key={movie.id}
              src={`${base_url}${isLargeRow ? movie.poster_path : movie.backdrop_path}`}
              alt={movie.name}
            />
          ))}
      </div>

      {isTrailerOpen && trailerUrl && (
        <div className="trailer-wrapper">
          <button className="close-button" onClick={handleTrailerClose}>
            <AiOutlineClose />
          </button>
          <button
            className="imdb-button"
            onClick={() =>
              window.open(
                `https://www.imdb.com/find?q=${encodeURIComponent(
                  selectedMovie.title
                )}&s=tt&ttype=ft&exact=true`
              )
            }
          >
            IMDb
          </button>
          <div className="trailer">
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

export default Row;
