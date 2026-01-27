import React, { useState } from "react";
import carDemo from "../assets/car-demo.png";
import { getCostComparison } from "../services/costComparisionTool";
import '../styles/Validation.css';

/*const evModels = {
  Tesla: [
    { model: "Model 3 RWD", efficiency: 14.0 },     // real-world approx kWh/100km
    { model: "Model Y Long Range", efficiency: 16.0 },
  ],
  MG: [
    { model: "ZS EV", efficiency: 18.0 },
    { model: "MG4", efficiency: 16.5 },
  ],
  BYD: [
    { model: "Atto 3", efficiency: 17.5 },
  ],
};
*/

export default function CostComparison() {
  //const [brand, setBrand] = useState("");
  //const [model, setModel] = useState("");
  const [kmsPerDay, setKmsPerDay] = useState("");           // shared field
  const [electricityCost, setElectricityCost] = useState(""); // ~ Melbourne 2026 avg home rate

  const [iceEff, setIceEff] = useState("");             // L/100km
  const [petrolPrice, setPetrolPrice] = useState("");  // $/L ~ Jan 2026 Melbourne

  const [formErrors, setFormErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [serverResult, setServerResult] = useState(null);

  // Quick client-side result (EV only + optional ICE)
  const [clientResult, setClientResult] = useState(null);

  const tokenFull = localStorage.getItem("currentUser");
  const token = tokenFull ? JSON.parse(tokenFull).token : null;

  // Reusable validator for positive numeric fields
  // Helper: validates that a field is filled and contains a number > 0
  const validatePositive = (value, label, unit) => {
    if (!value.trim()) {
      return `Please enter ${label}`;
    }

    const num = Number(value);
    if (isNaN(num) || num <= 0) {
      return `Must be greater than 0 ${unit}`;
    }

    return "";
  };

    const validate = () => {
      const errs = {};

      errs.kmsPerDay       = validatePositive(kmsPerDay,       "average km per day",  "km/day");
      errs.electricityCost = validatePositive(electricityCost, "electricity rate",    "$/kWh");
      errs.iceEff          = validatePositive(iceEff,          "fuel efficiency",     "L/100km");
      errs.petrolPrice     = validatePositive(petrolPrice,     "petrol price",        "$/L");

      // Remove empty string entries
    Object.keys(errs).forEach(key => {
      if (errs[key] === "") delete errs[key];
    });

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
    };

    

  const handleCalculate = async (e) => {
    e.preventDefault();
    setServerError("");
    setClientResult(null);
 
    if(!validate()) return;
    /*
      const ev = evModels[brand]?.find(m => m.model === model);
      const evEff = ev?.efficiency || 16.0;

      const evKwhDay = (kms / 100) * evEff;
      const evCostDay = evKwhDay * elec;


      // Client preview
      setClientResult({
        ev: { model: `${brand} ${model}`, eff: evEff, dailyCost: evCostDay.toFixed(2) },
      });
    */

    // Server call (original logic)
    setLoading(true);
    try {
      const payload = {
        distance_km: kmsPerDay,
        electricity_price_per_kwh: electricityCost,
        ice_eff_l_per_100km: iceEff,
        petrol_price_per_l: petrolPrice,
      };
      const response = await getCostComparison(payload, token);
      setServerResult(response);
    } catch (err) {
      setServerError(err.message || "Error contacting comparison service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container horizontal center">
      {/* Left: Car image + brand/model selector */}
      <div className="container vertical inner-left half-height">
        <img src={carDemo} alt="Car" className="cost-image" />
        
        {/*
          <label className="form-label required">EV Brand</label>
          <select
            className="input full-width"
            value={brand}
            onChange={(e) => {
              setBrand(e.target.value);
              setModel("");
              setFormErrors((prev) => ({ ...prev, brand: "", model: "" }));
            }}
          >
            <option value="">Select</option>
            {Object.keys(evModels).map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
          {formErrors.brand && <span className="error-text">{formErrors.brand}</span>}
        */}

         {/*
          <label className="form-label required">EV Model</label>
          <select
            className="input full-width"
            value={model}
            onChange={(e) => {
              setModel(e.target.value);
              setFormErrors((prev) => ({ ...prev, model: "" }));
            }}
            disabled={!brand}
          >
            <option value="">Select</option>
            {brand &&
              evModels[brand].map((m) => (
                <option key={m.model} value={m.model}>
                  {m.model} (~{m.efficiency} kWh/100km)
                </option>
              ))}
          </select>
          {formErrors.model && <span className="error-text">{formErrors.model}</span>}
        */}
        </div>
      {/* Right: Form + results */}
      <div className="container vertical hidden inner-center">
        <h2 className="h2 center auto-width">EV vs ICE Cost Comparison</h2>
        <p>Daily running cost estimate – Melbourne 2026</p>

        <form onSubmit={handleCalculate} className="form-section">
          <label className="form-label required">Average km per day</label>
          <input
            className="input full-width"
            type="number"
            min="1"
            step="1"
            value={kmsPerDay}
            onChange={(e) => {
              setKmsPerDay(e.target.value);
              setFormErrors((prev) => ({ ...prev, kmsPerDay: "" }));
            }}
            placeholder="e.g. 40"
          />
          {formErrors.kmsPerDay && <span className="error-text">{formErrors.kmsPerDay}</span>}

          <label className="form-label required">Electricity rate ($/kWh)</label>
          <input
            className="input full-width"
            type="number"
            min="0.01"
            step="0.01"
            value={electricityCost}
            onChange={(e) => {
              setElectricityCost(e.target.value);
              setFormErrors((prev) => ({ ...prev, electricityCost: "" }));
            }}
            placeholder="e.g. 0.30 (typical home rate)"
          />
          {formErrors.electricityCost && <span className="error-text">{formErrors.electricityCost}</span>}

          <label className="form-label required">Petrol efficiency (L/100km)</label>
          <input
            className="input full-width"
            type="number"
            min="0.1"
            step="0.1"
            value={iceEff}
            onChange={(e) => {
              setIceEff(e.target.value);
              setFormErrors((prev) => ({ ...prev, iceEff: "" }));
            }}
          />
          {formErrors.iceEff && <span className="error-text">{formErrors.iceEff}</span>}

          <label className="form-label required">Petrol price ($/L)</label>
          <input
            className="input full-width"
            type="number"
            min="0.01"
            step="0.01"
            value={petrolPrice}
            onChange={(e) => {
              setPetrolPrice(e.target.value);
              setFormErrors((prev) => ({ ...prev, petrolPrice: "" }));
            }}
          />
          {formErrors.petrolPrice && <span className="error-text">{formErrors.petrolPrice}</span>}
        

          <div className="spacer" />

          <button
            className="btn btn-primary btn-full-width"
            type="submit"
            disabled={loading}
          >
            {loading ? "Comparing..." : "Calculate & Compare"}
          </button>
        </form>

        {serverError && <p className="error-text">❌ {serverError}</p>}

        {/* Client-side preview */}
        {clientResult && (
          <div style={{ marginTop: 24, width: "100%" }}>
            <h3>Quick Estimate (daily)</h3>
            <div style={{ background: "#f8f9fa", padding: 16, borderRadius: 8 }}>
              <div><strong>EV:</strong> {clientResult.ev.model} – ${clientResult.ev.dailyCost}/day</div>
              {clientResult.ice && (
                <div><strong>Petrol:</strong> ~{clientResult.ice.eff} L/100km – ${clientResult.ice.dailyCost}/day</div>
              )}
            </div>
          </div>
        )}

        {/* Server result */}
        {serverResult && (
  <div style={{ marginTop: 24 }}>
    <h3>Server Comparison Result</h3>
    
    <div style={{
      background: "#f8f9fa",
      padding: 16,
      borderRadius: 8,
      fontSize: "1.05rem",
    }}>
      <div>
        <strong style={{ color: "black" }}>Predicted savings (EV vs ICE):</strong> 
        <span style={{ 
          color: serverResult.predicted_savings > 0 ? "green" : "red",
          fontWeight: "bold",
          marginLeft: 8,
        }}>
          {serverResult.predicted_savings.toFixed(2)} {serverResult.currency}
        </span>
      </div>
      
      <div style={{ marginTop: 8, fontSize: "0.9rem", color: "#666" }}>
        Based on model: {serverResult.model_version}
      </div>
    </div>
  </div>
)}
      </div>
    </div>
  );
}