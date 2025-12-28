import React, { useEffect, useState, useMemo, useContext } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import L from 'leaflet';
import NavBar from '../components/NavBar';
import LocateUser from '../components/LocateUser';
import ClusterMarkers from '../components/ClusterMarkers';
import SmartFilter from '../components/SmartFilter';
import { UserContext } from '../context/user';
import ChargerSideBar from '../components/ChargerSideBar';
import { FavouritesContext } from '../context/FavouritesContext';
import { getChargers, getConnectorTypes, getOperatorTypes } from '../services/chargerService';
import ChatBubble from "../components/ChatBubble";

// styles
import '../styles/SmartFilter.css';
import '../styles/Map.css';

// Configure default Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

// Utility function to parse cost
function parseCost(costStr) {
  if (!costStr || typeof costStr !== "string") {
    return null; // return null if not parsable
  }

  const lower = costStr.toLowerCase().trim();

  // Handle free
  if (lower.includes("free")) return 0;

  // Handle cents (e.g., 55c)
  const centsMatch = lower.match(/([\d.]+)\s*(c|cent|cents)\b/);
  if (centsMatch) return parseInt(centsMatch[1], 10);

  // Handle $ amounts with optional per-unit info (e.g., $0.2/kwh, $0.60 per kwh)
  const dollarMatch = lower.match(/\$([\d.]+)/);
  if (dollarMatch) {
    const dollars = parseFloat(dollarMatch[1]);
    return Math.round(dollars * 100); // always return integer cents
  }

  // Fallback: parse any number in string
  const numMatch = lower.match(/([\d.]+)/);
  if (numMatch) return parseInt(numMatch[1], 10);

  // If nothing matches, return null
  return null;
}


//Define the same normalisation logic you used when fetching operator types in charger service
function normaliseOperatorName(name) {
  if (!name) return "Unknown";

  const lower = name.toLowerCase().trim();

  // Tesla group
  if (lower.includes("tesla")) {
    return "Tesla";
  }

  // Evie group
  if (lower.includes("evie")) {
    return "Evie";
  }

  // Pulse group
  if (lower.includes("pulse")) {
    return "BP Pulse";
  }

  // Ampcharge group
  if (lower.includes("ampcharge")) {
    return "Ampol Ampcharge";
  }

  // NRMA group
  if (lower.includes("nrma")) {
    return "NRMA";
  }

  // Unknown group
  if (lower.includes("unknown")) {
    return "Unknown";
  }

  return name;
}

// Watches map bounds (bbox) and reports them upward
function BoundsWatcher({ onChange }) {
  const map = useMapEvents({
    moveend() {
      const b = map.getBounds();
      onChange([b.getWest(), b.getSouth(), b.getEast(), b.getNorth()]);
    }
  });

  useEffect(() => {
    const b = map.getBounds();
    onChange([b.getWest(), b.getSouth(), b.getEast(), b.getNorth()]);
  }, [map, onChange]);

  return null;
}

export default function Map() {
  const { user } = useContext(UserContext);

  // define the minimum price of a charger and maximum here
  const priceMin = 0;
  const priceMax = 100;

  const [filters, setFilters] = useState({
    chargerType: [],
    chargingSpeed: [],
    priceRange: [priceMin, priceMax],
    operatorType: [],
    showOnlyAvailable: false,
    showCongestion: true
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [stations, setStations] = useState([]);
  const [bbox, setBbox] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [selectedStation, setSelectedStation] = useState(null);
  const { favourites, toggleFavourite } = useContext(FavouritesContext);
  const [connectorTypes, setConnectorTypes] = useState([]);
  const [operatorTypes, setOperatorTypes] = useState([]);

  // local UI state for the floating dark-mode button icon
  const [isDark, setIsDark] = useState(false);

  // toggle dark mode only when inside the Map page
  useEffect(() => {
    if (isDark) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
    return () => {
      document.body.classList.remove("dark-mode");
    };
  }, [isDark]);

  // Fetch chargers only when token available and bbox changes
  useEffect(() => {
    let mounted = true;
    let id;

    if (!user?.token) {
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        setErr('');
        const data = await getChargers(user, bbox ? { bbox } : undefined);
        if (mounted) setStations(Array.isArray(data) ? data : []);
      } catch (e) {
        if (mounted) setErr(e.message || 'Failed to load chargers');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    setLoading(true);
    load();
    id = setInterval(load, 15000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, [bbox, user?.token]);

  // fetching connector and operator types
  useEffect(() => {
    if (!user) return;

    async function fetchConnectorTypes() {
      try {
        const types = await getConnectorTypes(user);
        setConnectorTypes(types);
      } catch (err) {
        console.error("Failed to load connector types", err);
      }
    }

    async function fetchOperatorTypes() {
      try {
        const types = await getOperatorTypes(user);
        setOperatorTypes(types);
      } catch (err) {
        console.error("Failed to load operator types", err);
      }
    }

    fetchConnectorTypes();
    fetchOperatorTypes();
  }, [user]);
  //Type 2 tethered connector doesnt work because each station has a trailing space in the connector_types that we have filtered out in chargerservice.js

  // Apply filters on stations
  const filteredStations = useMemo(() => {
    return stations.filter(station => {
      const { connection_type, power_output, cost, operator } = station;
      // Charger type filter
      if (filters.chargerType.length > 0 && !filters.chargerType.includes(connection_type)) {
        return false;
      }

      //Speed filter
      if (filters.chargingSpeed.length > 0) {
        const speed = Number(power_output); // parse as number
        const ok = filters.chargingSpeed.some(range => {
          switch (range) {
            case '<7kW':
              return speed < 7;
            case '7-22kW':
              return speed >= 7 && speed <= 22;
            case '22-50kW':
              return speed > 22 && speed <= 50;
            case '50-150kW':
              return speed > 50 && speed <= 150;
            case '150kW-250kW':
              return speed > 150 && speed <= 250;
            case '250kW+':
              return speed > 250;
            default:
              return false;
          }
        });
        if (!ok) return false;
      }

      // Price filter      
      const price = parseCost(cost);
      // if (price === null) return false; // this will remove all 'unknown' costs
      if (price < filters.priceRange[0] || price > filters.priceRange[1]) return false;

      // Operator filter
      if (filters.operatorType.length > 0) {
        const normalisedOperator = normaliseOperatorName(operator);
        // Determine if operator is considered "Other"
        const bigGroups = operatorTypes.filter(op => op !== "Other");
        const opForFilter = bigGroups.includes(normalisedOperator) ? normalisedOperator : "Other";

        if (!filters.operatorType.includes(opForFilter)) {
          return false;
        }
      }

      // Available filter
      if (filters.showOnlyAvailable && station.is_operational !== 'true') {
        return false;
      }

      return true;
    });
  }, [stations, filters]);

  return (
    <div className={`map-page ${isDark ? "dark" : ""}`}>
      <NavBar />
      <div style={{ position: 'relative', height: '100vh', width: '100%' }}>
        <button
          className="filter-toggle-button"
          onClick={() => setIsFilterOpen(true)}
        >
          🔍 Smart Filters
        </button>

        {loading && (
          <div style={{
            position: 'absolute',
            top: 12,
            left: 12,
            zIndex: 1000,
            background: '#fff',
            padding: '6px 10px',
            borderRadius: 6
          }}>
            Loading…
          </div>
        )}
        {err && (
          <div style={{
            position: 'absolute',
            top: 44,
            left: 12,
            zIndex: 1000,
            background: '#ffdddd',
            padding: '6px 10px',
            borderRadius: 6
          }}>
            {err}
          </div>
        )}

        <MapContainer center={[-37.8136, 144.9631]} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <BoundsWatcher onChange={setBbox} />
          <ClusterMarkers
            showCongestion={filters.showCongestion}
            stations={filteredStations}
            onSelectStation={(st) => setSelectedStation(st)}
          />


          <LocateUser />
        </MapContainer>

        <button
          className="dark-mode-floating"
          aria-label="Toggle dark mode"
          onClick={() => setIsDark(prev => !prev)}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? '🌙' : '☀️'}
        </button>

        <SmartFilter
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          filters={filters}
          setFilters={setFilters}
          filteredCount={filteredStations.length}
          priceMin={priceMin}
          priceMax={priceMax}
          connectorTypes={connectorTypes}
          operatorTypes={operatorTypes}
        />
        <ChargerSideBar
          station={selectedStation}
          onClose={() => setSelectedStation(null)}
          favourites={favourites}
          toggleFavourite={toggleFavourite}
        />
        <ChatBubble />
      </div>
    </div>
  );
}
