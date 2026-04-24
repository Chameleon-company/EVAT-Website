import React, { useEffect, useContext, useRef, useMemo, useState } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.markercluster';
import { congestionIcon } from '../utils/chargerIcons';
import { FavouritesContext } from '../context/FavouritesContext';
import { getChargerCongestion } from '../services/chargerCongestionService';
import { UserContext } from '../context/user';

function ClusterMarkers({ showCongestion, stations, selectedStation, onSelectStation }) {
  const map = useMap();
  const { favourites } = useContext(FavouritesContext);
  const { user } = useContext(UserContext);
  
  const clusterGroupRef = useRef(null);
  const [congestionLevels, setCongestionLevels] = useState({});
  
  const stationIDs = useMemo(
    () => stations.map(station => station._id),
    [stations]
  );

  // Init cluster group
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

  // Fetch congestion
  useEffect(() => {
    if (!user?.token || stationIDs.length === 0) return;
    
    let cancelled = false;
    
    async function fetchCongestion() {
      try {
        const response = await getChargerCongestion(stationIDs, user.token);
        if (!cancelled && response?.data?.congestionLevels) {
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

  // Render markers
  useEffect(() => {
    if (!clusterGroupRef.current) return;
    
    const group = clusterGroupRef.current;
    group.clearLayers();

    stations.forEach((st) => {
      const lat = parseFloat(st.latitude);
      const lng = parseFloat(st.longitude);
      if (isNaN(lat) || isNaN(lng)) return;

      const level = congestionLevels[st._id]?.congestion_level;

      const isSelected =
        selectedStation && st._id === selectedStation._id;

      let icon;

      if (isSelected) {
        // 🔥 Highlight marker
        icon = L.divIcon({
          className: 'selected-marker',
          html: '⚡',
          iconSize: [40, 40],
          iconAnchor: [20, 20],
        });

        // Zoom + focus
        map.flyTo([lat, lng], 16);
      } else {
        icon =
          congestionIcon(showCongestion, level) ||
          new L.Icon.Default();
      }

      const marker = L.marker([lat, lng], { icon });

      marker.on('click', () => {
        onSelectStation?.(st);
      });

      group.addLayer(marker);
    });

  }, [stations, showCongestion, congestionLevels, onSelectStation, selectedStation, map]);

  return null;
}

export default ClusterMarkers;