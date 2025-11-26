import { useState, useEffect } from "react";
import favoriteService from "../services/favoriteService"; // ✅ no { }

export const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const data = await favoriteService.getAll();
      // Normalize fields to camelCase expected by UI
      const normalized = (Array.isArray(data) ? data : []).map((d) => ({
        id: d.id,
        cityName: d.cityName || d.city_name || d.city || '',
        country: d.country || d.country_code || '',
        latitude: d.latitude ?? d.lat ?? null,
        longitude: d.longitude ?? d.lon ?? null,
        createdAt: d.created_at || d.createdAt || null,
      }));
      setFavorites(normalized);
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  };

  const addFavorite = async (favoriteData) => {
    try {
      const payload = {
        cityName: favoriteData.name || favoriteData.location?.split(",")[0],
        country: favoriteData.sys?.country || favoriteData.location?.split(",")[1],
        latitude: favoriteData.coord?.lat || favoriteData.latitude,
        longitude: favoriteData.coord?.lon || favoriteData.longitude,
      };
      const saved = await favoriteService.add(payload);
      // Normalize saved item too
      const normalized = {
        id: saved.id,
        cityName: saved.cityName || saved.city_name || payload.cityName,
        country: saved.country || payload.country,
        latitude: saved.latitude ?? payload.latitude,
        longitude: saved.longitude ?? payload.longitude,
        createdAt: saved.created_at || saved.createdAt || null,
      };
      setFavorites((prev) => [...prev, normalized]);
    } catch (error) {
      console.error("Error adding favorite:", error);
    }
  };

  const removeFavorite = async (id) => {
    try {
      await favoriteService.remove(id);
      setFavorites((prev) => prev.filter((f) => f.id !== id));
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  const clearFavorites = async () => {
    try {
      await favoriteService.clearAll();
      setFavorites([]);
    } catch (error) {
      console.error("Error clearing favorites:", error);
    }
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    clearFavorites,
  };
};
