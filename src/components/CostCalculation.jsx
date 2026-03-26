import React, { useState, useEffect } from "react";
import carDemo from "../assets/car-demo.png";
import {
    getCostComparison,
    getCostCharts,
    getEvVehicles,
    getIceVehicles,
} from "../services/costComparisionTool";
import CostCharts from "./CostCharts";
import '../styles/Validation.css';

export default function CostComparison() {
    // EV selector
    const [evVehicles, setEvVehicles] = useState({});
    const [evMake, setEvMake] = useState("");
    const [evModel, setEvModel] = useState("");
    const [evVariant, setEvVariant] = useState("");

    // ICE selector
    const [iceVehicles, setIceVehicles] = useState({});
    const [iceMake, setIceMake] = useState("");
    const [iceModel, setIceModel] = useState("");
    const [iceVariant, setIceVariant] = useState("");

    // Shared inputs
    const [kmsPerDay, setKmsPerDay] = useState("");
    const [electricityCost, setElectricityCost] = useState("");
    const [petrolPrice, setPetrolPrice] = useState("");

    // UI state
    const [formErrors, setFormErrors] = useState({});
    const [serverError, setServerError] = useState("");
    const [loading, setLoading] = useState(false);
    const [serverResult, setServerResult] = useState(null);
    const [chartData, setChartData] = useState(null);

    const tokenFull = localStorage.getItem("currentUser");
    const token = tokenFull ? JSON.parse(tokenFull).token : null;

    // Load vehicle lists on mount
    useEffect(() => {
        const loadVehicles = async () => {
            try {
                const [evData, iceData] = await Promise.all([
                    getEvVehicles(token),
                    getIceVehicles(token),
                ]);
                setEvVehicles(evData);
                setIceVehicles(iceData);
            } catch (err) {
                console.error("Failed to load vehicles:", err);
            }
        };
        loadVehicles();
    }, []);

    // Derived lists
    const evMakes    = Object.keys(evVehicles).sort();
    const evModels   = evMake ? Object.keys(evVehicles[evMake] || {}).sort() : [];
    const evVariants = (evMake && evModel) ? (evVehicles[evMake]?.[evModel] || []) : [];

    const iceMakes    = Object.keys(iceVehicles).sort();
    const iceModels   = iceMake ? Object.keys(iceVehicles[iceMake] || {}).sort() : [];
    const iceVariants = (iceMake && iceModel) ? (iceVehicles[iceMake]?.[iceModel] || []) : [];

    const validate = () => {
        const errs = {};
        if (!evMake)  errs.evMake  = "Please select an EV make";
        if (!evModel) errs.evModel = "Please select an EV model";
        if (!iceMake)  errs.iceMake  = "Please select a petrol car make";
        if (!iceModel) errs.iceModel = "Please select a petrol car model";
        if (!kmsPerDay.trim() || Number(kmsPerDay) <= 0)
            errs.kmsPerDay = "Please enter average km per day";
        if (!electricityCost.trim() || Number(electricityCost) <= 0)
            errs.electricityCost = "Please enter electricity rate";
        if (!petrolPrice.trim() || Number(petrolPrice) <= 0)
            errs.petrolPrice = "Please enter petrol price";
        setFormErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleCalculate = async (e) => {
        e.preventDefault();
        setServerError("");
        setServerResult(null);
        setChartData(null);

        if (!validate()) return;

        setLoading(true);
        try {
            const payload = {
                distance_km:              parseFloat(kmsPerDay),
                electricity_price_per_kwh: parseFloat(electricityCost),
                petrol_price_per_l:        parseFloat(petrolPrice),
                ev_make:    evMake,
                ev_model:   evModel,
                ev_variant: evVariant || null,
                ice_make:    iceMake,
                ice_model:   iceModel,
                ice_variant: iceVariant || null,
            };

            const [response, charts] = await Promise.all([
                getCostComparison(payload, token),
                getCostCharts(payload, token),
            ]);

            setServerResult(response);
            setChartData(charts);
        } catch (err) {
            setServerError(err.message || "Error contacting comparison service");
        } finally {
            setLoading(false);
        }
    };

    const selectStyle = {
        background: "#1a2035",
        border: "1px solid #2e3a5c",
        borderRadius: 8,
        color: "#c8d4f0",
        padding: "8px 12px",
        width: "100%",
        marginBottom: 4,
        fontSize: 14,
    };

    const sectionLabel = {
        fontSize: 11,
        fontWeight: 500,
        color: "#8899cc",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        marginBottom: 8,
        marginTop: 16,
    };

    return (
        <div className="container horizontal center">
            {/* Left: Car image */}
            <div className="container vertical inner-left half-height">
                <img src={carDemo} alt="Car" className="cost-image" />
            </div>

            {/* Right: Form + results */}
            <div className="container vertical hidden inner-center">
                <h2 className="h2 center auto-width">EV vs Petrol Cost Comparison</h2>
                <p>Daily running cost estimate — Melbourne 2026</p>

                <form onSubmit={handleCalculate} className="form-section">

                    {/* EV Selector */}
                    <div style={sectionLabel}>Your EV</div>

                    <label className="form-label required">EV Make</label>
                    <select style={selectStyle} value={evMake} onChange={e => { setEvMake(e.target.value); setEvModel(""); setEvVariant(""); }}>
                        <option value="">Select make</option>
                        {evMakes.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    {formErrors.evMake && <span className="error-text">{formErrors.evMake}</span>}

                    <label className="form-label required">EV Model</label>
                    <select style={selectStyle} value={evModel} onChange={e => { setEvModel(e.target.value); setEvVariant(""); }} disabled={!evMake}>
                        <option value="">Select model</option>
                        {evModels.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    {formErrors.evModel && <span className="error-text">{formErrors.evModel}</span>}

                    <label className="form-label">EV Variant (optional)</label>
                    <select style={selectStyle} value={evVariant} onChange={e => setEvVariant(e.target.value)} disabled={!evModel}>
                        <option value="">Select variant</option>
                        {evVariants.map(v => <option key={v} value={v}>{v}</option>)}
                    </select>

                    {/* ICE Selector */}
                    <div style={sectionLabel}>Your Petrol Car</div>

                    <label className="form-label required">Petrol Car Make</label>
                    <select style={selectStyle} value={iceMake} onChange={e => { setIceMake(e.target.value); setIceModel(""); setIceVariant(""); }}>
                        <option value="">Select make</option>
                        {iceMakes.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    {formErrors.iceMake && <span className="error-text">{formErrors.iceMake}</span>}

                    <label className="form-label required">Petrol Car Model</label>
                    <select style={selectStyle} value={iceModel} onChange={e => { setIceModel(e.target.value); setIceVariant(""); }} disabled={!iceMake}>
                        <option value="">Select model</option>
                        {iceModels.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    {formErrors.iceModel && <span className="error-text">{formErrors.iceModel}</span>}

                    <label className="form-label">Petrol Car Variant (optional)</label>
                    <select style={selectStyle} value={iceVariant} onChange={e => setIceVariant(e.target.value)} disabled={!iceModel}>
                        <option value="">Select variant</option>
                        {iceVariants.map(v => <option key={v} value={v}>{v}</option>)}
                    </select>

                    {/* Trip inputs */}
                    <div style={sectionLabel}>Trip Details</div>

                    <label className="form-label required">Average km per day</label>
                    <input
                        className="input full-width"
                        type="number" min="1" step="1"
                        value={kmsPerDay}
                        onChange={e => { setKmsPerDay(e.target.value); setFormErrors(p => ({ ...p, kmsPerDay: "" })); }}
                        placeholder="e.g. 40"
                    />
                    {formErrors.kmsPerDay && <span className="error-text">{formErrors.kmsPerDay}</span>}

                    <label className="form-label required">Electricity rate ($/kWh)</label>
                    <input
                        className="input full-width"
                        type="number" min="0.01" step="0.01"
                        value={electricityCost}
                        onChange={e => { setElectricityCost(e.target.value); setFormErrors(p => ({ ...p, electricityCost: "" })); }}
                        placeholder="e.g. 0.30"
                    />
                    {formErrors.electricityCost && <span className="error-text">{formErrors.electricityCost}</span>}

                    <label className="form-label required">Petrol price ($/L)</label>
                    <input
                        className="input full-width"
                        type="number" min="0.01" step="0.01"
                        value={petrolPrice}
                        onChange={e => { setPetrolPrice(e.target.value); setFormErrors(p => ({ ...p, petrolPrice: "" })); }}
                        placeholder="e.g. 2.00"
                    />
                    {formErrors.petrolPrice && <span className="error-text">{formErrors.petrolPrice}</span>}

                    <div className="spacer" />

                    <button className="btn btn-primary btn-full-width" type="submit" disabled={loading}>
                        {loading ? "Comparing..." : "Calculate & Compare"}
                    </button>
                </form>

                {serverError && <p className="error-text">❌ {serverError}</p>}

                {/* Results */}
                {serverResult && (
                    <div style={{ marginTop: 24, width: "100%" }}>
                        <div style={{
                            background: serverResult.predicted_savings > 0 ? "#1e3a2e" : "#3a1e1e",
                            border: `1px solid ${serverResult.predicted_savings > 0 ? "#2d5a3d" : "#5a2d2d"}`,
                            borderRadius: 12, padding: 20, textAlign: "center", marginBottom: 16,
                        }}>
                            <div style={{ fontSize: 12, color: serverResult.predicted_savings > 0 ? "#6b9e7a" : "#9e6b6b", marginBottom: 4 }}>
                                Predicted savings (EV vs petrol)
                            </div>
                            <div style={{ fontSize: 36, fontWeight: 500, color: serverResult.predicted_savings > 0 ? "#4ade80" : "#f87171" }}>
                                ${Math.abs(serverResult.predicted_savings).toFixed(2)} {serverResult.currency}
                            </div>
                            <div style={{ fontSize: 12, color: serverResult.predicted_savings > 0 ? "#6b9e7a" : "#9e6b6b", marginTop: 4 }}>
                                {serverResult.predicted_savings > 0 ? "EV is cheaper for this trip" : "Petrol is cheaper for this trip"}
                            </div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 8 }}>
                            {[
                                { label: "EV trip cost",    value: `$${serverResult.ev_trip_cost?.toFixed(2) ?? "—"}`,  color: "#60a5fa" },
                                { label: "Petrol trip cost", value: `$${serverResult.ice_trip_cost?.toFixed(2) ?? "—"}`, color: "#f87171" },
                                { label: "CO₂ saved",       value: `${serverResult.co2_saved_kg?.toFixed(2) ?? "—"} kg`, color: "#4ade80" },
                                { label: "EV emissions",    value: `${serverResult.ev_co2_kg?.toFixed(2) ?? "—"} kg`,   color: "#94a3b8" },
                                { label: "ICE emissions",   value: `${serverResult.ice_co2_kg?.toFixed(2) ?? "—"} kg`,  color: "#94a3b8" },
                                { label: "ML model",        value: serverResult.model_version,                           color: "#60a5fa" },
                            ].map(({ label, value, color }) => (
                                <div key={label} style={{ background: "#1a2035", border: "1px solid #2e3a5c", borderRadius: 10, padding: 14, textAlign: "center" }}>
                                    <div style={{ fontSize: 11, color: "#6b7db3", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>{label}</div>
                                    <div style={{ fontSize: 16, fontWeight: 500, color }}>{value}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <CostCharts chartData={chartData} />
            </div>
        </div>
    );
}