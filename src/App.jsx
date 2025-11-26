import React, { useState } from 'react';
import Navbar from './components/Navbar';
import WeatherPage from './pages/WeatherPage';
import FavoritesPage from './pages/FavoritesPage';
import './index.css';

function App() {
  const [currentPage, setCurrentPage] = useState('weather');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);

  // Sample favorites array (replace with backend data if needed)
  const [favorites, setFavorites] = useState([
    { id: 11, cityName: "Delhi", country: "IN", humidity: 50, windSpeed: 10 },
    { id: 12, cityName: "Mumbai", country: "IN", humidity: 60, windSpeed: 15 },
    { id: 13, cityName: "Paris", country: "FR", humidity: 55, windSpeed: 12 },
  ]);

  // Navigate to favorites
  const handleFavoritesClick = () => {
    setCurrentPage('favorites');
  };

  // Navigate back to weather
  const handleBackToWeather = () => {
    setCurrentPage('weather');
  };

  // Select location from favorites
  const handleSelectLocation = (location) => {
    setSelectedLocation(location);
    setCurrentPage('weather');
  };

  // Weather data loaded callback
  const handleWeatherLoaded = (weather) => {
    setCurrentWeather(weather);
  };

  // Remove favorite
  const handleRemoveFavorite = (id) => {
    setFavorites(prev => prev.filter(fav => fav.id !== id));
  };

  return (
    <div className="weather-app">
      {/* Render Navbar only if NOT on favorites page */}
      {currentPage !== 'favorites' && (
        <Navbar onNavigate={setCurrentPage} />
      )}

      {currentPage === 'weather' && (
        <div className="container">
          <WeatherPage 
            onFavoritesClick={handleFavoritesClick} 
            selectedLocation={selectedLocation}
            onWeatherLoaded={handleWeatherLoaded}
          />
        </div>
      )}

      {currentPage === 'favorites' && (
        <FavoritesPage 
          favorites={favorites}                  // pass favorites array
          onBack={handleBackToWeather} 
          onSelectLocation={handleSelectLocation}
          onRemoveFavorite={handleRemoveFavorite} // pass remove handler
          currentWeather={currentWeather}
        />
      )}

    </div>
  );
}

export default App;
