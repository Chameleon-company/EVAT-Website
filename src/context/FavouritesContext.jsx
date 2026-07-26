import React, { createContext, useState, useEffect, useContext } from "react";
import { UserContext } from "./user";

const API_URL = import.meta.env.VITE_API_URL;

export const FavouritesContext = createContext();

export function FavouritesProvider({ children }) {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useContext(UserContext);
  const token = user?.token;

  // Fetch favourites from backend
  useEffect(() => {
    const fetchFavourites = async () => {
      if (!token) {
        setFavourites([]);
        setLoading(false);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${API_URL}/profile/user-profile`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to load favourites");

        const data = await res.json();
        setFavourites(data.data.favourite_stations || []);
      } catch (err) {
        console.error("Fetch favourites error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFavourites();
  }, [token]);

  // Toggle favourite station (save/remove in DB)
  const toggleFavourite = async (station) => {
    if (!token) {
      const authError = new Error("Not authenticated");
      setError(authError.message);
      throw authError;
    }

    const isFav = favourites.some((s) => s._id === station._id);

    const url = isFav
      ? `${API_URL}/profile/remove-favourite-station`
      : `${API_URL}/profile/add-favourite-station`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ stationId: station._id }),
      });

      if (!res.ok) throw new Error("Failed to update favourite");

      // Update UI after successful backend request
      if (isFav) {
        setFavourites((prev) =>
          prev.filter((s) => s._id !== station._id)
        );
      } else {
        setFavourites((prev) => [station, ...prev]);
      }
    } catch (err) {
      console.error("Toggle favourite error:", err);
      setError(err.message);
      throw err;
    }
  };

  return (
    <FavouritesContext.Provider
      value={{ favourites, toggleFavourite, loading, error }}
    >
      {children}
    </FavouritesContext.Provider>
  );
}