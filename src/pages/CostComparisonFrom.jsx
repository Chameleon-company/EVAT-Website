import { useState } from "react";
import { getCostComparison } from "../services/costComparisionTool";

export default function CostComparisonForm() {
  const [form, setForm] = useState({
    distance_km: "",
    electricity_price_per_kwh: "",
    ice_eff_l_per_100km: "",
    petrol_price_per_l: "",
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const tokenFull = localStorage.getItem("currentUser"); // optional

  const token = tokenFull ? JSON.parse(tokenFull).token : null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: Number(e.target.value) });
  };

  const handleSubmit = async (e) => {
    console.log('token', token);
    
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await getCostComparison(form, token);
      setResult(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.card}>
      <h2>EV vs ICE Cost Comparison</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input name="distance_km" placeholder="Distance (km)" type="number" onChange={handleChange} required />
        <input name="electricity_price_per_kwh" placeholder="Electricity price ($/kWh)" type="number" step="0.01" onChange={handleChange} required />
        <input name="ice_eff_l_per_100km" placeholder="ICE efficiency (L/100km)" type="number" step="0.1" onChange={handleChange} required />
        <input name="petrol_price_per_l" placeholder="Petrol price ($/L)" type="number" step="0.01" onChange={handleChange} required />

        <button type="submit" disabled={loading}>
          {loading ? "Calculating..." : "Compare"}
        </button>
      </form>

      {error && <p style={styles.error}>❌ {error}</p>}

      {result && (
        <pre style={styles.result}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}

const styles = {
  card: {
    maxWidth: 420,
    margin: "40px auto",
    padding: 20,
    borderRadius: 8,
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    background: "#fff",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  error: {
    color: "red",
    marginTop: 10,
  },
  result: {
    marginTop: 15,
    background: "#f4f4f4",
    padding: 10,
    borderRadius: 4,
  },
};
