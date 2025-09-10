import React, { useState, useContext, useEffect } from 'react';
import '../styles/ChargerSideBar.css';
import { FavouritesContext } from '../context/FavouritesContext';


import { useNavigate } from 'react-router-dom';

export default function ChargerSideBar({ station, onClose }) {
  const [feedback, setFeedback] = useState('');
  const [kWh, setKWh] = useState('');
  const [pricePerKWh, setPricePerKWh] = useState('');
  const { favourites, toggleFavourite } = useContext(FavouritesContext);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);



  const navigate = useNavigate();
  if (!station) return null;

  // Check if station is in favourites
  const isFav = favourites.some(s => s._id === station._id);

  const estimatedCost = kWh && pricePerKWh ? (kWh * pricePerKWh).toFixed(2) : '';

  return (
    <div className="sidebar-container">
      <button className="close-btn" onClick={onClose}>✖</button>

      <div className="sidebar-section">
        <h3>📌 Charger Info</h3>
        <ul>
          <li><strong>Operator:</strong> {station.operator || 'N/A'}</li>
          <li><strong>Type:</strong> {station.connection_type || 'N/A'}</li>
          <li><strong>Power:</strong> {station.power_output || 'N/A'} kW</li>
          <li><strong>Cost:</strong> {station.cost || 'N/A'}</li>
          <li><strong>Access:</strong> {station.access_key_required === 'true' ? 'Restricted' : 'Open'}</li>
        </ul>

<button
  className="booking-btn"
  onClick={() => navigate('/bookingtool', { state: { station } })}
>
  📅 Book this charger
</button>

        <button
          onClick={() => toggleFavourite(station)}
          className="favourite-btn"
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: "1.8rem"
          }}
        >
          <span style={{ color: isFav ? "red" : "grey" }}>
            {isFav ? "❤️" : "🤍"}
          </span>
        </button>
      </div>

      <div className="sidebar-section">
        <h4 style={{ marginBottom: '4px' }}>⭐ Rate this charger</h4>
        <div className="rating-stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              style={{
                cursor: 'pointer',
                fontSize: '1.5rem',
                color: (hoverRating || rating) >= star ? '#f39c12' : '#ccc'
              }}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
            >
              ★
            </span>
          ))}
        </div>

        <h3>✍️ Feedback</h3>
        <textarea
          placeholder="Write your feedback..."
          value={feedback}
          onChange={e => setFeedback(e.target.value)}
        />
        <button onClick={() => alert("Thanks for your feedback!")}>Submit</button>
      </div>

      <div className="sidebar-section">
        <h3>💰 Charge Estimator</h3>
        <input
          type="number"
          placeholder="Energy (kWh)"
          value={kWh}
          onChange={e => setKWh(e.target.value)}
        />
        <input
          type="number"
          placeholder="Price per kWh ($)"
          value={pricePerKWh}
          onChange={e => setPricePerKWh(e.target.value)}
        />
        {estimatedCost && <p>Estimated cost: <strong>${estimatedCost}</strong></p>}
      </div>
    </div>
  );
}
