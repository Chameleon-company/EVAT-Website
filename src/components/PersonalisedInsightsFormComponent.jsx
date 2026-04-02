import React, { useState } from "react";
import { submitInsights } from "../services/personalisedEvInsightsService"
//import axios from "axios";

export default function PersonalisedInsightsFormComponent() {
  const tokenFull = localStorage.getItem("currentUser");
  const token = tokenFull ? JSON.parse(tokenFull).token : null;

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: "",
    fuelType: "",
    avgKmPerWeek: "",
    avgKmPerDay: "",
    drivingDaysPerWeek: "",
    mainTripPurpose: "",
    tripLength: "",
    monthlyFuelSpend: "",
    fuelEfficiency: "",
    petrolPrice: "",
    planningToSwitchEV: "",
    chargingPreference: "",
    homeChargingAccess: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      // userId: "Strawberry",
      // email: "strawberry@jam.com",
      weekly_km: 153,
      trip_length: "Mostly medium trips (10-50 km)",
      driving_frequency: "Daily",
      driving_type: "A mix of city/suburban and highway driving",
      road_trips: "No",
      car_ownership: "Yes - Petrol",
      fuel_efficiency: 7.9,
      monthly_fuel_spend: 84.32,
      home_charging: "Yes",
      solar_panels: "Yes",
      charging_preference: "Home",
      budget: "<$40,000",
      priorities: "Cost savings, Environmental impact",
      postcode: "3095",
      //cluster: null
      // createdAt: Date,
      // updatedAt: Date
    }

    if (!formData.fullName || !formData.email) {
      setMessage("Please fill in the required fields.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      //await axios.post("http://localhost:8080/api/insights/submit", formData);
      const response = await submitInsights(payload, token);

      setMessage("Form submitted successfully.");

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        vehicleMake: "",
        vehicleModel: "",
        vehicleYear: "",
        fuelType: "",
        avgKmPerWeek: "",
        avgKmPerDay: "",
        drivingDaysPerWeek: "",
        mainTripPurpose: "",
        tripLength: "",
        monthlyFuelSpend: "",
        fuelEfficiency: "",
        petrolPrice: "",
        planningToSwitchEV: "",
        chargingPreference: "",
        homeChargingAccess: ""
      });
    } catch (error) {
      console.error("Submission error:", error);
      setMessage("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="insights-page-wrapper">
      <div className="insights-panel">
        <h1 className="insights-title">Personalised EV Usage Insights</h1>
        <p className="insights-subtitle">
          Fill in your details to receive personalised EV insights based on your
          driving behaviour.
        </p>

        <form onSubmit={handleSubmit} className="insights-form">
          <div className="insights-grid">
            <div>
              <h3 className="insights-section-title">Personal Details</h3>

              <div className="form-section">
                <label className="form-label required">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>

              <div className="form-section">
                <label className="form-label required">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-section">
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <h3 className="insights-section-title">Vehicle Details</h3>

              <div className="form-section">
                <label className="form-label">Vehicle Make</label>
                <input
                  type="text"
                  name="vehicleMake"
                  placeholder="e.g. Toyota"
                  value={formData.vehicleMake}
                  onChange={handleChange}
                />
              </div>

              <div className="form-section">
                <label className="form-label">Vehicle Model</label>
                <input
                  type="text"
                  name="vehicleModel"
                  placeholder="e.g. Corolla"
                  value={formData.vehicleModel}
                  onChange={handleChange}
                />
              </div>

              <div className="form-section">
                <label className="form-label">Vehicle Year</label>
                <input
                  type="number"
                  name="vehicleYear"
                  placeholder="e.g. 2020"
                  value={formData.vehicleYear}
                  onChange={handleChange}
                />
              </div>

              <div className="form-section">
                <label className="form-label">Fuel Type</label>
                <select
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleChange}
                >
                  <option value="">Select fuel type</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <h3 className="insights-section-title">Driving Behaviour</h3>

              <div className="form-section">
                <label className="form-label">Average KM Per Week</label>
                <input
                  type="number"
                  name="avgKmPerWeek"
                  placeholder="e.g. 250"
                  value={formData.avgKmPerWeek}
                  onChange={handleChange}
                />
              </div>

              <div className="form-section">
                <label className="form-label">Average KM Per Day</label>
                <input
                  type="number"
                  name="avgKmPerDay"
                  placeholder="e.g. 40"
                  value={formData.avgKmPerDay}
                  onChange={handleChange}
                />
              </div>

              <div className="form-section">
                <label className="form-label">Driving Days Per Week</label>
                <input
                  type="number"
                  name="drivingDaysPerWeek"
                  placeholder="e.g. 5"
                  value={formData.drivingDaysPerWeek}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <h3 className="insights-section-title">Trip and Fuel Details</h3>

              <div className="form-section">
                <label className="form-label">Main Trip Purpose</label>
                <select
                  name="mainTripPurpose"
                  value={formData.mainTripPurpose}
                  onChange={handleChange}
                >
                  <option value="">Select trip purpose</option>
                  <option value="Commute">Commute</option>
                  <option value="Business">Business</option>
                  <option value="Leisure">Leisure</option>
                  <option value="Mixed">Mixed</option>
                </select>
              </div>

              <div className="form-section">
                <label className="form-label">Typical Trip Length</label>
                <select
                  name="tripLength"
                  value={formData.tripLength}
                  onChange={handleChange}
                >
                  <option value="">Select trip length</option>
                  <option value="Short">Short</option>
                  <option value="Medium">Medium</option>
                  <option value="Long">Long</option>
                </select>
              </div>

              <div className="form-section">
                <label className="form-label">Monthly Fuel Spend ($)</label>
                <input
                  type="number"
                  name="monthlyFuelSpend"
                  placeholder="e.g. 300"
                  value={formData.monthlyFuelSpend}
                  onChange={handleChange}
                />
              </div>

              <div className="form-section">
                <label className="form-label">Fuel Efficiency (L/100km)</label>
                <input
                  type="number"
                  name="fuelEfficiency"
                  placeholder="e.g. 7.5"
                  value={formData.fuelEfficiency}
                  onChange={handleChange}
                />
              </div>

              <div className="form-section">
                <label className="form-label">Petrol Price ($/L)</label>
                <input
                  type="number"
                  name="petrolPrice"
                  placeholder="e.g. 1.80"
                  value={formData.petrolPrice}
                  onChange={handleChange}
                />
              </div>

              <h3 className="insights-section-title">EV Preferences</h3>

              <div className="form-section">
                <label className="form-label">Planning to Switch to EV?</label>
                <select
                  name="planningToSwitchEV"
                  value={formData.planningToSwitchEV}
                  onChange={handleChange}
                >
                  <option value="">Select option</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                  <option value="Maybe">Maybe</option>
                </select>
              </div>

              <div className="form-section">
                <label className="form-label">Charging Preference</label>
                <select
                  name="chargingPreference"
                  value={formData.chargingPreference}
                  onChange={handleChange}
                >
                  <option value="">Select preference</option>
                  <option value="Fastest">Fastest</option>
                  <option value="Cheapest">Cheapest</option>
                  <option value="Premium">Premium</option>
                </select>
              </div>

              <div className="form-section">
                <label className="form-label">Home Charging Access</label>
                <select
                  name="homeChargingAccess"
                  value={formData.homeChargingAccess}
                  onChange={handleChange}
                >
                  <option value="">Select option</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>
          </div>

          <div className="insights-button-wrap">
            <button type="submit" className="insights-submit-btn" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>

          {message && <p className="insights-message">{message}</p>}
        </form>
      </div>
    </div>
  );
}