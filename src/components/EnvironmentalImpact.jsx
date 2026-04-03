import React, { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function EnvironmentalImpact({ 
  // This data is given from the Profile.jsx when the Environmental Impact button is pressed
  user, 
  allElectricVehicles,
  makes
}) {
  
  // Local state for EV dropdowns
  const [selectedEvMake, setSelectedEvMake] = useState("Select");
  const [selectedEvModel, setSelectedEvModel] = useState("Select");
  const [selectedEvVariant, setSelectedEvVariant] = useState("Select");
  const [selectedEvYear, setSelectedEvYear] = useState("Select");
  const [selectedEv, setSelectedEv] = useState("Select");

  // Local state for ICE dropdowns
  const [selectedIceMake, setSelectedIceMake] = useState("Select");
  const [selectedIceModel, setSelectedIceModel] = useState("Select");
  const [selectedIceVariant, setSelectedIceVariant] = useState("Select");
  const [selectedIceYear, setSelectedIceYear] = useState("Select");
  const [selectedIce, setSelectedIce] = useState("Select");

  // States for ICE data
  const [allIceVehicles, setAllIceVehicles] = useState([]);
  const [iceMakes, setIceMakes] = useState(["Select"]);
  const [loadingIce, setLoadingIce] = useState(false);
  const [iceError, setIceError] = useState(null);

  // State for comparison result
  const [comparisonResult, setComparisonResult] = useState(null);
  const [loadingCompare, setLoadingCompare] = useState(false);
  const [errorCompare, setErrorCompare] = useState(null);

  // Fetch ICE vehicles ONLY when this component mounts
  useEffect(() => {
    const fetchIceVehicles = async () => {
      if (!user?.token || loadingIce) return;

      setLoadingIce(true);
      setIceError(null);

      try {
        const res = await fetch(`${API_URL}/vehicle`, {   // ← adjust endpoint if needed
          headers: { Authorization: `Bearer ${user.token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch ICE vehicles");

        const data = await res.json();
        const items = (data.data || []).map((v) => ({
          ...v,
          id: v.id || v._id,
          year: v.year || v.model_release_year,
        }))
        .filter((v) => v.fuel_type && v.fuel_type !== "Pure Electric");  // Ensure we only keep ICE vehicles

        setAllIceVehicles(items);
        setIceMakes(["Select", ...new Set(items.map((v) => v.make))]);
      } catch (err) {
        console.error("Failed to load ICE vehicles:", err);
        setIceError(err.message);
      } finally {
        setLoadingIce(false);
      }
    };

    fetchIceVehicles();
  }, [user?.token]);

  // Filter EV models, variants and years based on selection
  const filteredEvModels = allElectricVehicles
    .filter(v => v.make === selectedEvMake)
    .map(v => v.model);

  const filteredEvVariants = allElectricVehicles
    .filter(v => v.make === selectedEvMake && v.model === selectedEvModel)
    .map(v => v.variant);

  const filteredEvYears = allElectricVehicles
    .filter(v => v.make === selectedEvMake && v.model === selectedEvModel && v.variant === selectedEvVariant)
    .map(v => v.year || v.model_release_year)
    .filter(Boolean);

  // Save the selected EV object to access other data
  useEffect(() => {
    if (selectedEvMake === "Select" || selectedEvModel === "Select" || selectedEvYear === "Select") {
      setSelectedEv(null);
      return;
    }

    const found = allElectricVehicles.find(v => 
      v.make === selectedEvMake &&
      v.model === selectedEvModel &&
      v.variant === selectedEvVariant &&
      String(v.year || v.model_release_year) === String(selectedEvYear)
    );

    setSelectedEv(found || null);
  }, [selectedEvMake, selectedEvModel, selectedEvVariant, selectedEvYear, allElectricVehicles]);

  // Fetch comparison result whenever selected EV or ICE changes
  useEffect(() => {
  const fetchComparison = async () => {
    if (!selectedEv?.id || !selectedIce?.id) return;

    try {
      setLoadingCompare(true);
      setErrorCompare(null);

      const res = await fetch(
        `${API_URL}/environmental-impact/compare?evVehicleId=${selectedEv.id}&iceVehicleId=${selectedIce.id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch comparison");
      }

      const data = await res.json();
      console.log("COMPARE RESULT:", data);

      setComparisonResult(data);
    } catch (err) {
      console.error(err);
      setErrorCompare(err.message);
    } finally {
      setLoadingCompare(false);
    }
  };

  fetchComparison();
}, [selectedEv, selectedIce]);

  // Filter ICE models, variants and years based on selection
  const filteredIceModels = allIceVehicles
    .filter(v => v.make === selectedIceMake)
    .map(v => v.model);

  const filteredIceVariants = allIceVehicles
    .filter(v => v.make === selectedIceMake && v.model === selectedIceModel)
    .map(v => v.variant);

  const filteredIceYears = allIceVehicles
    .filter(v => v.make === selectedIceMake && v.model === selectedIceModel && v.variant === selectedIceVariant)
    .map(v => v.year || v.model_release_year)
    .filter(Boolean);

  // Save the selected ICE object to access other data
  useEffect(() => {
    if (selectedIceMake === "Select" || selectedIceModel === "Select" || selectedIceYear === "Select") {
      setSelectedIce(null);
      return;
    }

    const found = allIceVehicles.find(v => 
      v.make === selectedIceMake &&
      v.model === selectedIceModel &&
      v.variant === selectedIceVariant &&
      String(v.year || v.model_release_year) === String(selectedIceYear)
    );

    setSelectedIce(found || null);
  }, [selectedIceMake, selectedIceModel, selectedIceVariant, selectedIceYear, allIceVehicles]);

  // Loading ICE data
  if (loadingIce) return <div className="horizontal center">Loading petrol/diesel vehicles...</div>;
  // Error while loading ICE data
  if (iceError) return <div className="horizontal center">Error loading ICE vehicles: {iceError}</div>;

  return (
    <div className="horizontal center">
      <table className="table">
        <thead>
          <tr>
            <td className="three-hundred-width">
              {/* EV Make Dropdown */}
              <select
                className="input two-hundred-width"
                value={selectedEvMake}
                onChange={(e) => {
                  setSelectedEvMake(e.target.value);
                  setSelectedEvModel("Select");
                  setSelectedEvVariant("Select");
                  setSelectedEvYear("Select");
                }}
              >
                {makes.map((make, idx) => (
                  <option key={idx} value={make}>
                    {make}
                  </option>
                ))}
              </select>

              {/* EV Model Dropdown */}
              <select
                className="input two-hundred-width"
                value={selectedEvModel}
                onChange={(e) => {
                  setSelectedEvModel(e.target.value);
                  setSelectedEvVariant("Select");
                  setSelectedEvYear("Select");
                }}
                // Disable unless make is chosen
                disabled={selectedEvMake === "Select"}
              >
                {["Select", ...new Set(filteredEvModels)].map((model, idx) => (
                  <option key={idx} value={model}>
                    {model}
                  </option>
                ))}
              </select>

              {/* EV variant Dropdown */}
              <select
                className="input two-hundred-width"
                value={selectedEvVariant}
                onChange={(e) => {
                  setSelectedEvVariant(e.target.value);
                  setSelectedEvYear("Select");
                }}
                // Disable unless model is chosen
                disabled={selectedEvModel === "Select"}
              >
                {["Select", ...new Set(filteredEvVariants)].map((variant, idx) => (
                  <option key={idx} value={variant}>
                    {variant}
                  </option>
                ))}
              </select>

              {/* EV Year Dropdown */}
              <select
                className="input two-hundred-width"
                value={selectedEvYear}
                onChange={(e) => setSelectedEvYear(e.target.value)}
                // Disable unless variant is chosen
                disabled={selectedEvVariant === "Select"}
              >
                {["Select", ...new Set(filteredEvYears.map(String))].map((year, idx) => (
                  <option key={idx} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </td>

            <td className="two-hundred-width"></td>  {/* Blank */}
            <td className="three-hundred-width">
              {/* ICE Make Dropdown */}
              <select
                className="input two-hundred-width"
                value={selectedIceMake}
                onChange={(e) => {
                  setSelectedIceMake(e.target.value);
                  setSelectedIceModel("Select");
                  setSelectedIceVariant("Select");
                  setSelectedIceYear("Select");
                }}
              >
                {iceMakes.map((make, idx) => (
                  <option key={idx} value={make}>
                    {make}
                  </option>
                ))}
              </select>

              {/* ICE Model Dropdown */}
              <select
                className="input two-hundred-width"
                value={selectedIceModel}
                onChange={(e) => {
                  setSelectedIceModel(e.target.value);
                  setSelectedIceVariant("Select");
                  setSelectedIceYear("Select");
                }}
                // Disable unless make is chosen
                disabled={selectedIceMake === "Select"}
              >
                {["Select", ...new Set(filteredIceModels)].map((model, idx) => (
                  <option key={idx} value={model}>
                    {model}
                  </option>
                ))}
              </select>

              {/* ICE variant Dropdown */}
              <select
                className="input two-hundred-width"
                value={selectedIceVariant}
                onChange={(e) => {
                  setSelectedIceVariant(e.target.value);
                  setSelectedIceYear("Select");
                }}
                // Disable unless model is chosen
                disabled={selectedIceModel === "Select"}
              >
                {["Select", ...new Set(filteredIceVariants)].map((variant, idx) => (
                  <option key={idx} value={variant}>
                    {variant}
                  </option>
                ))}
              </select>

              {/* ICE Year Dropdown */}
              <select
                className="input two-hundred-width"
                value={selectedIceYear}
                onChange={(e) => setSelectedIceYear(e.target.value)}
                // Disable unless variant is chosen
                disabled={selectedIceVariant === "Select"}
              >
                {["Select", ...new Set(filteredIceYears.map(String))].map((year, idx) => (
                  <option key={idx} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </td>
          </tr>
        </thead>

        <tbody>
          <tr>
            {/* EV vehicle details */}
            <td className="table-col-left">
              {selectedEv != null && (
                <>
                  <div className="text-xlarge font-bold">{selectedEv.make} {selectedEv.model} </div>
                  <div className="text-small">
                    {selectedEv.variant} - {selectedEv.year} <br /> 
                    {selectedEv.fuel_type}
                  </div>
                </>
              )}
            </td>
            <td></td>
            {/* ICE vehicle details */}
            <td className="table-col-left">
              {selectedIce != null && (
                <>
                  <div className="text-xlarge font-bold">{selectedIce.make} {selectedIce.model} </div>
                  <div className="text-small">
                    {selectedIce.variant} - {selectedIce.year} <br /> 
                    {selectedIce.fuel_type}
                  </div>
                </>
              )}
            </td>
          </tr>
          {/* co2 emissions row */}
          <tr>
            <td className="table-col-center">
              {selectedEv != null && (
                <>
                  {selectedEv.co2_emissions_combined}
                </>
              )}
            </td>
            <td className="font-bold">CO2 Emissions</td>
            <td className="table-col-center">
              {selectedIce != null && (
                <>
                  {selectedIce.co2_emissions_combined}
                </>
              )}
            </td>
          </tr>
          {/* fuel consumption row */}
          <tr>
            <td className="table-col-center">
              {selectedEv != null && (
                <>
                  {selectedEv.fuel_consumption_combined}
                </>
              )}
            </td>
            <td className="font-bold">Fuel Consumption</td>
            <td className="table-col-center">
              {selectedIce != null && (
                <>
                  {selectedIce.fuel_consumption_combined}
                </>
              )}
            </td>
          </tr>
          {/* life cycle co2 row */}
          <tr>
            <td className="table-col-center">
              {selectedEv != null && (
                <>
                  {selectedEv.fuel_life_cycle_co2}
                </>
              )}
            </td>
            <td className="font-bold">Fuel Life Cycle CO2</td>
            <td className="table-col-center">
              {selectedIce != null && (
                <>
                  {selectedIce.fuel_life_cycle_co2}
                </>
              )}
            </td>
          </tr>
          {/* annual tailpipe co2 row */}
          <tr>
            <td className="table-col-center">
              {selectedEv != null && (
                <>
                  {selectedEv.annual_tailpipe_co2}
                </>
              )}
            </td>
            <td className="font-bold">Annual Tailpipe CO2</td>
            <td className="table-col-center">
              {selectedIce != null && (
                <>
                  {selectedIce.annual_tailpipe_co2}
                </>
              )}
            </td>
          </tr>
        </tbody>
      </table>

      {/* result summary */}
      <div>
        {selectedIce && selectedEv && (
          <>
            <h4>Results</h4>
            <p className="center">The {selectedEv.make} {selectedEv.model} emits {selectedIce.co2_emissions_combined - selectedEv.co2_emissions_combined} g/km less CO2 than {selectedIce.make} {selectedIce.model}</p>
          </>
        )}
      </div>
    </div>
  );
}