import React from 'react';
import './App.css';
import HomeScreen from './screens/HomeScreen';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginScreen from './screens/LoginScreen';
import { useEffect } from 'react';
import { auth } from './firebase';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout, selectUser } from './features/userSlice';
import ProfileScreen from './screens/ProfileScreen';
import Happy from './Happy';
import RecommendMovies from './RecommendMovies';

function App() {

  const user = useSelector(selectUser);
  // const user = "ravi";
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((userAuth) => {
      if(userAuth){
        //Logged in
        dispatch(
          login({
            uid : userAuth.uid,
            email : userAuth.email,
          })
        );
      }
      else{
        //Logged out
        dispatch(logout());
      }
    });

    return unsubscribe;
  }, [dispatch]);

  return (
    <div className="app">
      <Router>
        {
          !user ? ( <LoginScreen /> ) : (
          <Routes>
            <Route path="/profile" element={<ProfileScreen />} />
            <Route 
              exact path='/' element={<HomeScreen />}>
            </Route> 
            <Route path='/happy' element={<Happy />}></Route>
            <Route path='/sad' element={<Happy />}></Route>
            <Route path='/angry' element={<Happy />}></Route>
            <Route path='/surprise' element={<Happy />}></Route>
            <Route path='/neutral' element={<HomeScreen />}></Route>
            <Route path='/recommend_movies' element={<RecommendMovies />}></Route>
          </Routes> )
        }
      </Router>
    </div>
  );
}

export default App;
