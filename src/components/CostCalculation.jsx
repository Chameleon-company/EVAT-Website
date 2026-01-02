import React, { useState } from "react";
import carDemo from "../assets/car-demo.png";

const carData = {
  Tesla: [
    { model: "Model 3", efficiency: 6 },
    { model: "Model Y", efficiency: 5.5 }
  ],
  MG: [
    { model: "ZS EV", efficiency: 5 },
    { model: "Comet EV", efficiency: 4.5 }
  ]
};

export default function CostCalculation() {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [efficiency, setEfficiency] = useState(0);
  const [kmsPerDay, setKmsPerDay] = useState("");
  const [electricityCost, setElectricityCost] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [cost, setCost] = useState(0);

  const handleBrandChange = (e) => {
    setBrand(e.target.value);
    setModel("");
    setEfficiency(0);
  };

  const handleModelChange = (e) => {
    setModel(e.target.value);
    const selected = carData[brand].find(m => m.model === e.target.value);
    setEfficiency(selected ? selected.efficiency : 0);
  };

  const handleCalculate = (e) => {
    e.preventDefault();
    if (!brand || !model || !kmsPerDay || !electricityCost) return;
    const dailyCost = (parseFloat(kmsPerDay) / efficiency) * parseFloat(electricityCost);
    setCost(dailyCost.toFixed(2));
    setShowResult(true);
  };

  const handleEdit = () => setShowResult(false);

  return (
    <div className="container center">
      <div className="container container-left half-height">
        <img src={carDemo} alt="Car" className="cost-image" />
        <label className='form-label required'>Brand</label>
        <select 
          className="input form-full-width"
          value={brand} 
          onChange={handleBrandChange}
        >
          <option value="">Select</option>
          {Object.keys(carData).map(b => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
        <label className='form-label required'>Model</label>
        <select 
          className="input form-full-width"
          value={model} 
          onChange={handleModelChange} 
          disabled={!brand}
        >
          <option value="">Select</option>
          {brand && carData[brand].map(m => (
            <option key={m.model} value={m.model}>{m.model}</option>
          ))}
        </select>
      </div>
      
      <div className="container-hidden container-center">
        {!showResult && (
          <form onSubmit={handleCalculate} className="form-section">
            <h2 className="h2 center auto-width">Cost Calculator</h2>
            <p>Estimate your total EV cost based on your usage</p>
            <label className='form-label required'>Enter Avg. kms/day</label>
            <input
              className="input form-full-width"
              type="number"
              value={kmsPerDay}
              onChange={e => setKmsPerDay(e.target.value)}
              required
              min="1"
            />
            <label className='form-label required'>Enter Electricity Cost ($ per kWh)</label>
            <input
              className="input form-full-width"
              type="number"
              value={electricityCost}
              onChange={e => setElectricityCost(e.target.value)}
              required
              min="0"
              step="0.01"
            />
            <div className="spacer" />
            <button 
              className="btn btn-primary btn-full-width"
              type="submit" 
            >
              Calculate
            </button>
          </form>
        )}
        {showResult && (
          <div className="container-hidden container-center">
            <h2>Cost</h2>
            <h1>${cost}</h1>
            <div>
              <div>My car: <span className="font-bold">{brand} {model}</span></div>
              <div>Avg. kms/day:  <span className="font-bold">{kmsPerDay}</span></div>
              <div>Electricity Cost ($ per kWh):  <span className="font-bold">{electricityCost}</span></div>
            </div>
            <button 
              onClick={handleEdit} 
              className="btn btn-primary btn-full-width"
            >
              Calculate Another Vehicle Cost
            </button>
          </div>
        )}
      </div>
    </div>
  );
}