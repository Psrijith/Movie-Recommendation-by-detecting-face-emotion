import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import vnrflix__logo from './vnrflix__logo.png';
import './Nav.css';

function Nav() {
  const links = [
    { name: 'Home', link: '/' },
    { name: 'Happy', link: '/happy' },
    { name: 'Sad', link: '/sad' },
    { name: 'Angry', link: '/angry' },
    { name: 'Surprise', link: '/surprise' },
    { name: 'Recommend Movies', link: '/recommend_movies'}
  ];

  const [show, handleShow] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [inputHover, setInputHover] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  const transitionNavbar = () => {
    if (window.scrollY > 50) {
      handleShow(true);
    } else {
      handleShow(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', transitionNavbar);
    return () => window.removeEventListener('scroll', transitionNavbar);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const searchTerm = inputValue.toLowerCase();
    const matchedLink = links.find((link) =>
      link.name.toLowerCase().includes(searchTerm)
    );
    if (matchedLink) {
      navigate(matchedLink.link);
    }
    setInputValue('');
    setShowSearch(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <div className={`nav ${show && 'nav__black'}`}>
      <div className="left">
        <div className="brand">
          <img
            onClick={() => navigate('/')}
            className="nav__logo"
            src={vnrflix__logo}
            alt=""
          />

          <div
            className={`nav__menu-toggle ${menuOpen && 'open'}`}
            onClick={toggleMenu}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </div>
        </div>

        <div className="links-container">
          <ul className={`links ${menuOpen && 'open'}`}>
            {links.map(({ name, link }) => (
              <li key={name}>
                <Link to={link} onClick={closeMenu}>
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="right">
        <div className={`search ${showSearch ? 'show-search' : ''}`}>
          <form onSubmit={handleSearch}>
            <button
              className="search__button"
              onFocus={() => setShowSearch(true)}
              onBlur={() => {
                if (!inputHover) {
                  setShowSearch(false);
                }
              }}
            >
              <FaSearch />
            </button>

            <input
              type="text"
              placeholder="Search"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onMouseEnter={() => setInputHover(true)}
              onMouseLeave={() => setInputHover(false)}
              onBlur={() => {
                setShowSearch(false);
                setInputHover(false);
              }}
            />
          </form>
        </div>
        <div>
          <img
            onClick={() => navigate('/profile')}
            className="nav__avatar"
            src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png"
            alt=""
          />
        </div>
      </div>
    </div>
  );
}

export default Nav;
