import L from 'leaflet';
import chargerGreen from '../assets/charger-icon-green.png';
import chargerYellow from '../assets/charger-icon-yellow.png';
import chargerRed from '../assets/charger-icon-red.png';
import chargerBlack from '../assets/charger-icon-black.png';
import chargerWhite from '../assets/charger-icon-white.png';

function createChargerIconCircle(iconUrl, color) {
  return L.divIcon({
    html: `
      <div style="
        width: 32px;
        height: 32px;
        background-color: white;
        border: 3px solid ${color};
        border-radius: 50%;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <img src="${iconUrl}" style="width: 20px; height: 20px;" />
      </div>
    `,
    iconSize: [22, 22],
    iconAnchor: [22, 22],
    popupAnchor: [0, -22]
  });
}

export const icons = {
  green: createChargerIconCircle(chargerGreen, '#4CAF50'),
  yellow: createChargerIconCircle(chargerYellow, '#FFC107'),
  red: createChargerIconCircle(chargerRed, '#F44336'),
  black: createChargerIconCircle(chargerBlack, '#333333'),
  white: createChargerIconCircle(chargerWhite, '#e4e4e4ff')
};

export function congestionIcon(showCongestion, congestionLevel) {
  if (!showCongestion) { 
    return icons.black;
  } else if (congestionLevel == "low") {
    return icons.green;
  } else if (congestionLevel == "medium") {
    return icons.yellow;
  } else if (congestionLevel == "high") {
    return icons.red;
  } else if (congestionLevel == "unknown") {
    return icons.black;
  } else {
    return icons.black;
  }
}