import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from './Nav';
import Banner from './Banner';
import './RecommendMovies.css'; // Import the CSS file

function RecommendMovies() {
  const [emotion, setEmotion] = useState(''); // State to store the emotion
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/recommend_movies')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setEmotion(data.emotion); // Set the emotion state
      })
      .catch((error) => {
        console.error('Error fetching recommendations:', error);
      });
  }, []);

  const go_to_that_emotion = () => {
    navigate(`/${emotion.toLowerCase()}`);
  };

  return (
    <div>
      <Nav />
      <Banner />
      <h1>Recommended Movies</h1>
      {emotion ? (
        <h2 className="emotion" onClick={go_to_that_emotion}>You seems to be <span>{emotion}</span></h2>
      ) : (
        <p className="loading">Loading...</p>
      )}
    </div>
  );
}

export default RecommendMovies;
