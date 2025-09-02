import React, { createContext, useState, useEffect } from "react";

export const FavouritesContext = createContext();

export function FavouritesProvider({ children }) {
  const [favourites, setFavourites] = useState([]);

  const getToken = () => {
    try {
      return JSON.parse(localStorage.getItem("currentUser"))?.accessToken;
    } catch {
      return null;
    }
  };

  // Load favourite station IDs from backend
  useEffect(() => {
    const token = getToken();
    if (!token) return;

    fetch("http://localhost:8080/api/profile/user-profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const favStations = data?.data?.favourite_stations || [];
        setFavourites(favStations);
      })
      .catch(console.error);
  }, []);

  // Toggle favourite
  const toggleFavourite = async (station) => {
    const token = getToken();
    if (!token) return;

    const isFav = favourites.some((s) => s._id === station._id || s === station._id);

    try {
      if (isFav) {
        await fetch("http://localhost:8080/api/profile/remove-favourite-station", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ stationId: station._id }),
        });
        setFavourites((prev) => prev.filter((s) => (typeof s === 'object' ? s._id : s) !== station._id));
      } else {
        await fetch("http://localhost:8080/api/profile/add-favourite-station", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ stationId: station._id }),
        });
        setFavourites((prev) => [...prev, station]); // store full object if available
      }
    } catch (err) {
      console.error("Failed to toggle favourite:", err);
    }
  };

  return (
    <FavouritesContext.Provider value={{ favourites, toggleFavourite }}>
      {children}
    </FavouritesContext.Provider>
  );
}
