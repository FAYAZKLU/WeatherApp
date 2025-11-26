import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';

const NAVBAR_HEIGHT_PX = 72; // Keep in sync with CSS

const Navbar = ({ onNavigate }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    window.dispatchEvent(new CustomEvent('app:search', { detail: { query: trimmed } }));
  };

  const handleMyLocation = () => {
    window.dispatchEvent(new CustomEvent('app:my-location'));
  };

  const goFavorites = () => {
  if (onNavigate) onNavigate('favorites');
};


  const goWeather = () => {
    if (onNavigate) onNavigate('weather');
  };

  return (
    <div className="navbar">
      <div className="navbar-inner">
        <button className="brand" onClick={goWeather} aria-label="Go to Weather">
          <img src="/WeatherApp/logo.svg" alt="Atmos logo" className="brand-logo" />
          <span className="brand-name">Atmos</span>
        </button>

        <form className="nav-search" onSubmit={handleSubmit}>
          <div className="nav-search-input-wrap">
            <input
              className="nav-search-input"
              type="text"
              placeholder="Search city..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Search className="nav-search-icon" />
          </div>
          <button type="submit" className="btn btn-primary nav-submit">Get Weather</button>
         
        </form>
      

        <div className="nav-actions">
          <button className="btn btn-location" onClick={handleMyLocation} aria-label="Use My Location">
            <MapPin className="h-4 w-4" />
            My Location
          </button>
           <button type="button" className="btn fav-bar" onClick={goFavorites}>My Cities</button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;



