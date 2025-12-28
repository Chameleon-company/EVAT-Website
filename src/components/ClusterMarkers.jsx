import React, { useEffect, useContext, useRef, useMemo, useState } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.markercluster';
import { congestionIcon } from '../utils/chargerIcons';
import { FavouritesContext } from '../context/FavouritesContext';
import { getChargerCongestion } from '../services/chargerCongestionService';
import { UserContext } from '../context/user';

function ClusterMarkers({ showCongestion, stations, onSelectStation }) {
  const map = useMap();
  const { favourites } = useContext(FavouritesContext);
  const { user } = useContext(UserContext);
  
  // Store cluster group in ref to persist
  const clusterGroupRef = useRef(null);
  
  // Store congestion data in state
  const [congestionLevels, setCongestionLevels] = useState({});
  
  // Memoize station IDs to prevent unnecessary API calls
  const stationIDs = useMemo(
    () => stations.map(station => station._id),
    [stations]
  );
  
  // Initialize cluster group
  useEffect(() => {
    clusterGroupRef.current = L.markerClusterGroup();
    map.addLayer(clusterGroupRef.current);
    
    return () => {
      if (clusterGroupRef.current) {
        map.removeLayer(clusterGroupRef.current);
        clusterGroupRef.current = null;
      }
    };
  }, [map]);
  
  // Fetch congestion data separately
  useEffect(() => {
    if (!user?.token || stationIDs.length === 0) return;
    
    let cancelled = false;
    
    async function fetchCongestion() {
      try {
        const response = await getChargerCongestion(stationIDs, user.token);
        if (!cancelled && response?.data?.congestionLevels) {
          // Convert array to lookup object
          const levelsMap = response.data.congestionLevels.reduce((map, level) => {
            map[level.chargerId] = level;
            return map;
          }, {});
          setCongestionLevels(levelsMap);
        }
      } catch (error) {
        console.error("Failed to fetch congestion levels:", error);
      }
    }
    
    fetchCongestion();
    
    return () => {
      cancelled = true;
    };
  }, [stationIDs, user?.token]);
  
  // Update markers when data changes
  useEffect(() => {
    if (!clusterGroupRef.current) return;
    
    const group = clusterGroupRef.current;
    
    // Clear existing markers
    group.clearLayers();
    
    // Add new markers
    stations.forEach((st) => {
      const lat = parseFloat(st.latitude);
      const lng = parseFloat(st.longitude);
      if (isNaN(lat) || isNaN(lng)) return;
      
      // Safely access congestion level
      const level = congestionLevels[st._id]?.congestion_level;
      const icon = congestionIcon(showCongestion, level) || new L.Icon.Default();
      const marker = L.marker([lat, lng], { icon });
      
      marker.on('click', () => {
        onSelectStation?.(st);
        console.log(st._id);
      });
      
      group.addLayer(marker);
    });
  }, [stations, showCongestion, congestionLevels, onSelectStation]);
  
  return null;
}

export default ClusterMarkers;