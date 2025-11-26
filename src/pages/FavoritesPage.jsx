import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trash2 } from 'lucide-react';
// Replaced FavoriteCard with inline card layout in this page per new design
import AddFavorite from '../components/AddFavorite';
import { useFavorites } from "../hooks/useFavorites";
import { useWeather } from '../hooks/useWeather';
import WeatherCard from '../components/WeatherCard';
import ForecastCard from '../components/ForecastCard';
import TemperatureChart from '../components/TemperatureChart';
import Toast from '../components/Toast';

const FavoritesPage = ({ onBack, onSelectLocation, currentWeather }) => {
  const { favorites, addFavorite, removeFavorite, clearFavorites } = useFavorites();
  const { weatherData, forecastData, hourlyTemps, fetchWeatherData, loading } = useWeather();
  const [showAddForm, setShowAddForm] = useState(false);
  const [pendingAdd, setPendingAdd] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [favoriteWeather, setFavoriteWeather] = useState({}); // id -> weather info

  console.log("Favorites from backend:", favorites);

  const handleAddFavorite = () => {
    if (currentWeather) {
      addFavorite(currentWeather);
      setShowAddForm(false);
    }
  };

  const handleSearchAndAdd = async (query) => {
    try {
      setPendingAdd(true);
      await fetchWeatherData(query);
    } catch (error) {
      console.error('Error searching for location:', error);
      setPendingAdd(false);
    }
  };

  useEffect(() => {
    if (pendingAdd && weatherData) {
      addFavorite(weatherData);
      setShowAddForm(false);
      setPendingAdd(false);
      setToastOpen(true);
    }
  }, [pendingAdd, weatherData, addFavorite]);

  // Fetch per-city current weather for each favorite
  useEffect(() => {
    if (!favorites || favorites.length === 0) {
      setFavoriteWeather({});
      return;
    }
    const apiKey = import.meta.env.VITE_OPEN_WEATHER_API_KEY;
    const controller = new AbortController();
    const loadAll = async () => {
      try {
        const results = await Promise.all(
          favorites.map(async (fav) => {
            if (!fav?.cityName) return [fav.id, null];
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(fav.cityName)}&units=metric&appid=${apiKey}`;
            const res = await fetch(url, { signal: controller.signal });
            if (!res.ok) return [fav.id, null];
            const data = await res.json();
            const info = {
              temp: Math.round(data.main?.temp ?? 0),
              min: Math.round(data.main?.temp_min ?? 0),
              max: Math.round(data.main?.temp_max ?? 0),
              condition: data.weather?.[0]?.main || '',
              description: data.weather?.[0]?.description || ''
            };
            return [fav.id, info];
          })
        );
        const map = Object.fromEntries(results);
        setFavoriteWeather(map);
      } catch (e) {
        // ignore aborts
      }
    };
    loadAll();
    return () => controller.abort();
  }, [favorites]);

  const handleSelectLocation = (favorite) => {
    // ✅ Use cityName instead of favorite.location (matches backend model)
    fetchWeatherData(favorite.cityName);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="container">
      <Toast open={toastOpen} onClose={() => setToastOpen(false)} message="Saved to Favorites" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="header"
      >
        <div className="flex items-center gap-4">
          <motion.button
            onClick={onBack}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="back-btn"
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </motion.button>
          <div>
            <h1 className="title">Favorite Locations</h1>
            <p className="subtitle">Your saved weather locations</p>
          </div>
        </div>

        {favorites.length > 0 && (
          <motion.button
            onClick={clearFavorites}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="clear-favorites-btn"
          >
            <Trash2 className="h-4 w-4" />
            Clear All
          </motion.button>
        )}
      </motion.div>

      {/* Add Favorite Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="add-favorite-section"
      >
        {!showAddForm ? (
          <motion.button
            onClick={() => setShowAddForm(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-primary"
          >
            Add New Favorite
          </motion.button>
        ) : (
          <AddFavorite
            onAdd={handleAddFavorite}
            onSearch={handleSearchAndAdd}
            loading={loading}
          />
        )}
      </motion.div>

      {/* Favorites + Details */}
      <div className="weather-content">
        {/* TEMP: Debug favorites count and names */}
        {favorites && favorites.length > 0 && (
          <div style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>
            {`Favorites: ${favorites.length} -> `}
            {favorites.map(f => f.cityName).join(', ')}
          </div>
        )}
        <div>
          {favorites.length > 0 ? (
            <div className="favorites-grid">
              {favorites.map((fav) => {
                const w = favoriteWeather[fav.id];
                return (
                  <motion.div key={fav.id} variants={itemVariants} initial="hidden" animate="visible" layout>
                    <div className="fav-weather-card" onClick={() => handleSelectLocation(fav)}>
                      <button
                        className="fav-card-delete"
                        title="Remove"
                        onClick={(e) => { e.stopPropagation(); removeFavorite(fav.id); }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <div className="fav-card-content">
                        <div className="fav-card-left">
                          <div className="fav-card-city">{fav.cityName}</div>
                          <div className="fav-card-condition">{w?.condition || '—'}</div>
                          {(w?.min !== undefined && w?.max !== undefined) && (
                            <div className="fav-card-range">{w.min} ~ {w.max}°C</div>
                          )}
                        </div>
                        <div className="fav-card-right">
                          <div className="fav-card-temp">{w?.temp ?? '—'}<span className="deg">°C</span></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="empty-favorites"
            >
              <p>No favorite locations yet. Add some to get started!</p>
            </motion.div>
          )}
        </div>

        {/* Weather details for selected location */}
        {weatherData && (
          <motion.div variants={itemVariants}>
            <WeatherCard weatherData={weatherData} />
            <div className="forecast-section" style={{ marginTop: '1rem' }}>
              <h2 className="forecast-title">5-Day Forecast</h2>
              <div className="forecast-grid">
                {forecastData.map((day) => (
                  <ForecastCard key={day.day} day={day} />
                ))}
              </div>
            </div>
            <div style={{ marginTop: '1rem' }}>
              <TemperatureChart hourly={hourlyTemps} />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
