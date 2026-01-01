// NOTE: Further potential developments:

// Limit the number of chargers displayed per page
// and add new pages to manage many favourite stations.
// Freeze column header while scrolling for easier viewing.

import { useContext } from "react";
import NavBar from "../components/NavBar";
import { FavouritesContext } from "../context/FavouritesContext";
import ChatBubble from "../components/ChatBubble";

import "../styles/Tables.css";
import '../styles/Buttons.css';
import '../styles/Fonts.css';
import '../styles/Forms.css';
import '../styles/Elements.css';

function Favourite() {
  const { favourites, toggleFavourite, loading, error } = useContext(FavouritesContext);

  return (
    <div>
      <NavBar />
      {/* background */}
      {/* background */}
      <div className="background-image" />
      {/* title */}
      <h1 className='h1 text-center full-width'>My Favourite Stations</h1>
      <div className="container center full-width">

        {error && <p className="error-msg">Error loading favourites: {error}</p>}
        {loading && !error && <p>Loading favourite stations...</p>}
        {!loading && !error && favourites.length === 0 && (
          <p>No favourites yet. Go to the map and ❤️ a station to save it here.</p>
        )}

        {!loading && !error && favourites.length > 0 && (
          <div className="table-wrapper center">
            <table className="table">
              <thead>
                <tr>
                  <th>Operator</th>
                  <th>Type</th>
                  <th>Power</th>
                  <th>Cost</th>
                  <th>Charging points</th>
                  <th>Status</th>
                  <th></th> {/* Unsave button column */}
                </tr>
              </thead>
              <tbody>
                {favourites.map((st) => (
                  <tr
                    key={st._id}
                    className={`table-row ${st.access_key_required === "true" ? "restricted" : "open"}`}
                  >
                    <td className="table-col-left">{st.operator || "Unknown"}</td>
                    <td className="table-col-center">{st.connection_type || "Unknown"}</td>
                    <td className="table-col-center">{st.power_output ? `${st.power_output} kW` : "N/A kW"}</td>
                    <td className="table-col-center">{st.cost || "Unknown"}</td>
                    <td className="table-col-center">{st.charging_points || 0}</td>
                    <td className="table-col-center">{st.access_key_required === "true" ? "Closed" : "Open"}</td>
                    <td className="table-col-center">
                      <button className="btn btn-danger btn-small" onClick={() => toggleFavourite(st)}>
                        Unsave
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <ChatBubble />
    </div>
  );
}

export default Favourite;