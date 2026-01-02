import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useMap, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import markerIconUrl from "../assets/marker-icon-red.png";

const markerIcon = new L.Icon({
  iconUrl: markerIconUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

function LocateUser({
  zoom = 15,
  fly = true,
  showMarker = true,
  showAccuracy = true,
  className = "",
  buttonTitle = "Locate me",
}) {
  const map = useMap();
  const [position, setPosition] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [container, setContainer] = useState(null);

  useEffect(() => {
    setContainer(map?.getContainer() ?? null);
  }, [map]);

  const centerMap = useCallback(
    (lat, lng) => {
      if (!map) return;
      const target = L.latLng(lat, lng);
      if (fly) map.flyTo(target, zoom, { duration: 0.8 });
      else map.setView(target, zoom);
    },
    [map, fly, zoom]
  );

  const handleSuccess = useCallback(
    (pos, shouldCenter = true) => {
      const { latitude, longitude, accuracy } = pos.coords;
      setPosition([latitude, longitude]);
      setAccuracy(typeof accuracy === "number" ? accuracy : null);
      if (shouldCenter) centerMap(latitude, longitude);
    },
    [centerMap]
  );

  const handleError = useCallback((err) => {
    console.error("Geolocation error:", err);
    alert("Unable to retrieve your location. Please check permissions.");
  }, []);

  const locateOnce = useCallback(() => {
    if (!("geolocation" in navigator)) {
      alert("Geolocation is not supported by this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => handleSuccess(pos, true),
      handleError,
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [handleSuccess, handleError]);

  useEffect(() => {
    if (!("geolocation" in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => handleSuccess(pos, true),
      handleError,
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [handleSuccess, handleError]);

  return (
    <>
      {container &&
        createPortal(
          <button
            type="button"
            className={`btn btn-primary btn-location ${className}`}
            title={buttonTitle}
            aria-label="Locate user"
            onClick={locateOnce}
            disabled={!("geolocation" in navigator)}
          >
            📍
          </button>,
          container
        )}

      {showMarker && position && (
        <Marker position={position} icon={markerIcon}>
          <Popup className="validation-success">You are here</Popup>
        </Marker>
      )}

      {showAccuracy && position && accuracy != null && (
        <Circle center={position} radius={accuracy} pathOptions={{ fillOpacity: 0.15 }} />
      )}
    </>
  );
}

export default LocateUser;
