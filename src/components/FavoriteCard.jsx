import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X, MapPin } from 'lucide-react';
import axios from 'axios';

const FavoriteCard = ({ favorite, onRemove, onSelect }) => {
  const [weather, setWeather] = useState(null);

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onRemove(favorite.id);
  };

  const handleSelect = () => {
    onSelect(favorite);
  };

  // Fetch current weather for this favorite city
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        if (!favorite?.cityName) return;
        const apiKey = import.meta.env.VITE_OPEN_WEATHER_API_KEY;
        const res = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${favorite.cityName}&units=metric&appid=${apiKey}`
        );
        const data = res.data;
        setWeather({
          temperature: Math.round(data.main.temp),
          icon: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
          description: data.weather[0].description
        });
      } catch (err) {
        console.error('Failed to fetch weather:', err);
      }
    };
    fetchWeather();
  }, [favorite]);

  if (!favorite?.cityName) return null; // Prevent rendering if cityName missing

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="favorite-card"
      onClick={handleSelect}
    >
      {/* Header */}
      <div className="favorite-header flex justify-between items-center">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-blue-300" />
          <h3 className="favorite-location">
            {favorite.cityName}, {favorite.country.trim()}
          </h3>
        </div>
        <button onClick={handleRemove} className="remove-favorite-btn" title="Remove from favorites">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Main weather info */}
      <div className="favorite-main mt-2">
        <div className="flex items-center space-x-3">
          <div className="favorite-temp">{weather?.temperature ?? '--'}°</div>
          {weather?.icon && <img src={weather.icon} alt="weather icon" className="favorite-icon" />}
        </div>
        <div className="favorite-description">{weather?.description || 'Loading...'}</div>
      </div>

      {/* Details */}
      <div className="favorite-details flex justify-between mt-2">
        <div className="favorite-detail">
          <span className="detail-value">{favorite?.humidity ?? '--'}%</span>
          <span className="detail-label">Humidity</span>
        </div>
        <div className="favorite-detail">
          <span className="detail-value">{favorite?.windSpeed ?? '--'} km/h</span>
          <span className="detail-label">Wind</span>
        </div>
      </div>
    </motion.div>
  );
};

export default FavoriteCard;
