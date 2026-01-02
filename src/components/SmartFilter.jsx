import { useEffect, useRef } from 'react';
import { Star, Heart, MessageCircle, X, ChevronDown, ChevronUp } from 'lucide-react';

import '../styles/SmartFilter.css';

/**
 * SmartFilter Component
 * 
 * A comprehensive filtering modal for EV charging stations that allows users to:
 * - Filter by charger type (CCS, CHAdeMO, Type 1, Type 2)
 * - Filter by charging speed (<22kW, 22-50kW, 50-150kW, 150kW+)
 * - Set price range with a slider (0-100)
 * - Toggle availability filter (show only available stations)
 * - Toggle reliability overlay
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
   * Toggle reliability overlay
   * Enables/disables the reliability score overlay on the map
   */
  const handleReliabilityToggle = () => {
    setFilters(prev => ({
      ...prev,
      showReliability: !prev.showReliability
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
      showReliability: true
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
    <div className="filter-overlay">
      <div className="filter-container" ref={modalRef}>
        <div className='sticky-top'>
          {/* Header */}
          <div className="filter-header">
            <h4>Filters</h4>
            <button className="btn btn-danger filter-btn-close" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>

        <div>
          {/* Charger Type Filter Section */}
          <div className="filter-section">
            <h5 className='text-center'>Charger Type</h5>
            <div className="filter-options">
              {connectorTypes.map(type => (
                <button
                  key={type}
                  className={`btn btn-options btn-tiny ${filters.chargerType.includes(type) ? 'selected' : ''}`}
                  onClick={() => handleChargerTypeToggle(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className='sidebar-linebreak' />
          {/* Charging Speed Filter Section */}
          <div className="filter-section">
            <h5 className='text-center'>Charging Speed</h5>
            <div className="filter-options">
              {chargingSpeeds.map(speed => (
                <button
                  key={speed}
                  className={`btn btn-options btn-tiny ${filters.chargingSpeed.includes(speed) ? 'selected' : ''}`}
                  onClick={() => handleChargingSpeedToggle(speed)}
                >
                  {speed}
                </button>
              ))}
            </div>
          </div>

          <div className='sidebar-linebreak' />
          {/* Price Range Filter Section */}
          <div className="filter-section">
            <h5 className='text-center'>Price Range (¢ per kWh)</h5>
              <div className="price-slider-container">
                {/* two range inputs */}
                <input
                  className="price-slider"
                  type="range"
                  min={priceMin}
                  max={priceMax}
                  value={filters.priceRange[0]}
                  onChange={handleMinChange}
                />
                <input
                  className="price-slider"
                  type="range"
                  min={priceMin}
                  max={priceMax}
                  value={filters.priceRange[1]}
                  onChange={handleMaxChange}
                />

                {/* labels */}
                <div className="price-slider-labels text-small">
                  <span>{priceMin}</span>
                  <span className="font-bold text-large">
                    {filters.priceRange[0]} - {filters.priceRange[1]}
                  </span>
                  <span>{priceMax}</span>
                </div>
              </div>
          </div>

          <div className='sidebar-linebreak' />
          {/* Charger Operator Filter Section */}
          <div className="filter-section">
            <h5 className='text-center'>Charger Operator</h5>
            <div className="filter-options">
              {operatorTypes.map(type => (
                <button
                  key={type}
                  className={`btn btn-options btn-tiny ${filters.operatorType.includes(type) ? 'selected' : ''}`}
                  onClick={() => handleOperatorToggle(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className='sidebar-linebreak' />
          {/* Availability Filter Section */}
          <div className="filter-section">
            <h5 className='text-center'>Availability</h5>
            <div className="toggle-holder">
              <label className='form-label '>Show only available stations?</label>
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

          <div className='sidebar-linebreak' />
          {/* Reliability Overlay Toggle Section */}
          <div className="filter-section">
            <h5 className='text-center'>Reliability Overlay</h5>
            <div className="toggle-holder">
              <label className='form-label '>Show reliability layer?</label>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={filters.showReliability}
                  onChange={handleReliabilityToggle}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        <div className="sticky-bottom filter-footer">
          <div className='sidebar-linebreak' />
          {/* Results Counter */}
          <h5 className='text-center'>
            {filteredCount} Station{filteredCount !== 1 ? 's' : ''} found
          </h5>
          {/* Action Buttons */}
          <div className="action-buttons">
            <button className="btn btn-secondary btn-force-flex btn-small" onClick={handleReset}>
              Reset
            </button>
            <button className="btn btn-primary btn-force-flex btn-small" onClick={handleApplyFilter}>
              Apply Filter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartFilter;
