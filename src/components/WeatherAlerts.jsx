import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WeatherAlerts = ({ alerts }) => {
  const getAlertInfo = (condition) => {
    const alertMap = {
      'thunderstorm': { emoji: '⛈️', title: 'Thunderstorm Alert', color: '#7C2D12' },
      'heavy_rain': { emoji: '🌧️', title: 'Heavy Rain Warning', color: '#1E40AF' },
      'extreme_heat': { emoji: '☀️', title: 'Extreme Heat Alert', color: '#DC2626' },
      'freezing': { emoji: '❄️', title: 'Freezing Conditions', color: '#1E40AF' },
      'high_wind': { emoji: '💨', title: 'High Wind Warning', color: '#7C2D12' },
      'fog': { emoji: '🌫️', title: 'Dense Fog Alert', color: '#6B7280' },
      'hail': { emoji: '🌩️', title: 'Hail Warning', color: '#7C2D12' },
      'normal': { emoji: '✅', title: 'Weather Normal', color: '#16a34a' },
      'snow': { emoji: '❄️', title: 'Snow Alert', color: '#1E40AF' }
    };
    
    return alertMap[condition] || { emoji: '⚠️', title: 'Weather Alert', color: '#DC2626' };
  };

  const detectAlerts = (weatherData, forecastData) => {
    const detectedAlerts = [];

    // Current weather alerts
    if (weatherData) {
      const temp = weatherData.temperature;
      const condition = weatherData.description.toLowerCase();
      const windSpeed = weatherData.windSpeed;

      // Extreme heat
      if (temp > 35) {
        detectedAlerts.push({
          id: 'heat-current',
          type: 'extreme_heat',
          message: `Extreme heat warning: ${temp}°C`,
          severity: 'high'
        });
      }

      // Freezing conditions
      if (temp < 0) {
        detectedAlerts.push({
          id: 'freeze-current',
          type: 'freezing',
          message: `Freezing conditions: ${temp}°C`,
          severity: 'high'
        });
      }

      // Thunderstorm
      if (condition.includes('thunderstorm')) {
        detectedAlerts.push({
          id: 'thunder-current',
          type: 'thunderstorm',
          message: 'Thunderstorm in progress',
          severity: 'high'
        });
      }

      // Heavy rain
      if (condition.includes('rain') && condition.includes('heavy')) {
        detectedAlerts.push({
          id: 'rain-current',
          type: 'heavy_rain',
          message: 'Heavy rainfall detected',
          severity: 'medium'
        });
      }

      // High wind
      if (windSpeed > 50) { // Converted to km/h
        detectedAlerts.push({
          id: 'wind-current',
          type: 'high_wind',
          message: `High winds: ${windSpeed} km/h`,
          severity: 'medium'
        });
      }
    }

    // Forecast alerts
    if (forecastData && forecastData.length > 0) {
      forecastData.forEach((day, index) => {
        if (index < 3) { // Check next 3 days
          const maxTemp = day.high;
          const minTemp = day.low;
          const condition = day.description.toLowerCase();

          // Extreme heat forecast
          if (maxTemp > 38) {
            detectedAlerts.push({
              id: `heat-forecast-${index}`,
              type: 'extreme_heat',
              message: `Extreme heat forecast for ${day.day}: ${maxTemp}°C`,
              severity: 'medium'
            });
          }

          // Freezing forecast
          if (minTemp < 2) {
            detectedAlerts.push({
              id: `freeze-forecast-${index}`,
              type: 'freezing',
              message: `Freezing conditions forecast for ${day.day}: ${minTemp}°C`,
              severity: 'medium'
            });
          }

          // Thunderstorm forecast
          if (condition.includes('thunderstorm')) {
            detectedAlerts.push({
              id: `thunder-forecast-${index}`,
              type: 'thunderstorm',
              message: `Thunderstorm forecast for ${day.day}`,
              severity: 'medium'
            });
          }

          // Heavy rain forecast
          if (condition.includes('rain') && condition.includes('heavy')) {
            detectedAlerts.push({
              id: `rain-forecast-${index}`,
              type: 'heavy_rain',
              message: `Heavy rain forecast for ${day.day}`,
              severity: 'low'
            });
          }
        }
      });
    }

    return detectedAlerts;
  };

  const detectedAlerts = detectAlerts(alerts.weatherData, alerts.forecastData);

  if (detectedAlerts.length === 0) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="weather-alerts"
      >
        <div className="alerts-header">
          <h3>Weather Alerts</h3>
        </div>
        
        <div className="alerts-list">
          {detectedAlerts.map((alert) => {
            const alertInfo = getAlertInfo(alert.type);
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`alert-item ${alert.severity}`}
                style={{ borderLeftColor: alertInfo.color }}
              >
                <div className="alert-emoji">{alertInfo.emoji}</div>
                <div className="alert-content">
                  <div className="alert-title" style={{ color: alertInfo.color }}>
                    {alertInfo.title}
                  </div>
                  <div className="alert-message">{alert.message}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WeatherAlerts;
