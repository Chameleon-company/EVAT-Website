import { useEffect, useRef } from 'react';
import '../styles/SmartFilter.css';

/**
 * SmartFilter Component
 * 
 * A comprehensive filtering modal for EV charging stations that allows users to:
 * - Filter by charger type (CCS, CHAdeMO, Type 1, Type 2)
 * - Filter by charging speed (<22kW, 22-50kW, 50-150kW, 150kW+)
 * - Set price range with a slider (0-100)
 * - Toggle availability filter (show only available stations)
 * - Toggle congestion overlay (reworked from reliability layer)
 * 
 * @param {boolean} isOpen - Controls modal visibility
 * @param {function} onClose - Callback to close the modal
 * @param {object} filters - Current filter state from parent component
 * @param {function} setFilters - Function to update filters in parent
 * @param {number} filteredCount - Number of stations matching current filters
 * @param {number} priceMin - Minimum price of station
 * @param {number} priceMax - Maximum price of station
 * @param {array} connectorTypes - Types of connectors to filter between
 * @param {array} operatorTypes - Types of operators to filter between
 */
const SmartFilter = ({
  isOpen,
  onClose,
  filters,
  setFilters,
  filteredCount,
  priceMin,
  priceMax,
  connectorTypes,
  operatorTypes
}) => {

  // Available filter options - these could be moved to a config file in a larger app
  const chargingSpeeds = [ '<7kW', '7-22kW', '22-50kW', '50-150kW', '150kW-250kW', '250kW+'];

  /**
   * Toggle charger type selection
   */
  const handleChargerTypeToggle = (type) => {
    setFilters(prev => ({
      ...prev,
      chargerType: prev.chargerType.includes(type)
        ? prev.chargerType.filter(t => t !== type)
        : [...prev.chargerType, type]
    }));
  };

  /**
   * Toggle charging speed selection
   */
  const handleChargingSpeedToggle = (speed) => {
    setFilters(prev => ({
      ...prev,
      chargingSpeed: prev.chargingSpeed.includes(speed)
        ? prev.chargingSpeed.filter(s => s !== speed)
        : [...prev.chargingSpeed, speed]
    }));
  };

  /**
   * Update price range filter
   */
  const handleMinChange = (e) => {
    const newMin = parseInt(e.target.value);
    setFilters((prev) => ({
      ...prev,
      priceRange: [Math.min(newMin, prev.priceRange[1]), prev.priceRange[1]], // keep min ≤ max
    }));
  };

  const handleMaxChange = (e) => {
    const newMax = parseInt(e.target.value);
    setFilters((prev) => ({
      ...prev,
      priceRange: [prev.priceRange[0], Math.max(newMax, prev.priceRange[0])], // keep max ≥ min
    }));
  };

  /**
   * Toggle charger operator selection
   */
  const handleOperatorToggle = (type) => {
  setFilters(prev => ({
    ...prev,
    operatorType: prev.operatorType.includes(type)
      ? prev.operatorType.filter(o => o !== type)
      : [...prev.operatorType, type]
  }));
};

  /**
   * Toggle availability filter
   */
  const handleAvailabilityToggle = () => {
    setFilters(prev => ({
      ...prev,
      showOnlyAvailable: !prev.showOnlyAvailable
    }));
  };

  /**
   * Toggle congestion icons
   * Enables/disables the congestion icons on the map
   */
  const handleCongestionToggle = () => {
    setFilters(prev => ({
      ...prev,
      showCongestion: !prev.showCongestion
    }));
  };

  /**
   * Reset all filters to default values
   */
  const handleReset = () => {
    const resetFilters = {
      chargerType: [],
      chargingSpeed: [],
      priceRange: [priceMin, priceMax],
      operatorType: [],
      showOnlyAvailable: false,
      showCongestion: true
    };
    setFilters(resetFilters);
  };

  /**
   * Closes the window (keeping apply button just for UX)
   */
  const handleApplyFilter = () => {
    onClose();
  };

  // Closes filter panel when clicking outside the smart filter
  const modalRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      // If click is outside modal, close it
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="smart-filter-overlay">
      <div className="smart-filter-panel" ref={modalRef}>
        {/* Modal Header */}
        <div className="smart-filter-header">
          <h2>Smart Filters</h2>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Charger Type Filter Section */}
        <div className="filter-section">
          <h3>Charger Type</h3>
          <div className="filter-options">
            {connectorTypes.map(type => (
              <button
                key={type}
                className={`filter-button ${filters.chargerType.includes(type) ? 'selected' : ''}`}
                onClick={() => handleChargerTypeToggle(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Charging Speed Filter Section */}
        <div className="filter-section">
          <h3>Charging Speed</h3>
          <div className="filter-options">
            {chargingSpeeds.map(speed => (
              <button
                key={speed}
                className={`filter-button ${filters.chargingSpeed.includes(speed) ? 'selected' : ''}`}
                onClick={() => handleChargingSpeedToggle(speed)}
              >
                {speed}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range Filter Section */}
        <div className="filter-section">
          <h3>Price Range (¢ per kWh)</h3>
            <div className="price-slider-container">
              {/* two range inputs */}
              <input
                type="range"
                min={priceMin}
                max={priceMax}
                value={filters.priceRange[0]}
                onChange={handleMinChange}
                className="price-slider"
              />
              <input
                type="range"
                min={priceMin}
                max={priceMax}
                value={filters.priceRange[1]}
                onChange={handleMaxChange}
                className="price-slider"
              />

              {/* labels */}
              <div className="price-labels">
                <span>{priceMin}</span>
                <span className="price-range-display">
                  {filters.priceRange[0]} - {filters.priceRange[1]}
                </span>
                <span>{priceMax}</span>
              </div>
            </div>
        </div>

        {/* Charger Operator Filter Section */}
        <div className="filter-section">
          <h3>Charger Operator</h3>
          <div className="filter-options">
            {operatorTypes.map(type => (
              <button
                key={type}
                className={`filter-button ${filters.operatorType.includes(type) ? 'selected' : ''}`}
                onClick={() => handleOperatorToggle(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Availability Filter Section */}
        <div className="filter-section">
          <h3>Availability</h3>
          <div className="toggle-container">
            <span className="toggle-label">show only available stations</span>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={filters.showOnlyAvailable}
                onChange={handleAvailabilityToggle}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        {/* Congestion Toggle Section */}
        <div className="filter-section">
          <h3>Congestion Icons</h3>
          <div className="toggle-container">
            <span className="toggle-label">Colors icons showing predicted congestion</span>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={filters.showCongestion}
                onChange={handleCongestionToggle}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        {/* Results Counter */}
        <div className="station-count">
          {filteredCount} Station{filteredCount !== 1 ? 's' : ''} found
        </div>

        {/* Action Buttons */}
        <div className="filter-actions">
          <button className="reset-button" onClick={handleReset}>
            Reset
          </button>
          <button className="apply-button" onClick={handleApplyFilter}>
            Apply Filter
          </button>
        </div>
      </div>
    </div>
  );
};

export default SmartFilter;
