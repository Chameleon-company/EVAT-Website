import React, { useState } from "react";
import { submitInsights } from "../services/personalisedEvInsightsService"
//import axios from "axios";

export default function PersonalisedInsightsFormComponent() {
  const tokenFull = localStorage.getItem("currentUser");
  const token = tokenFull ? JSON.parse(tokenFull).token : null;

  const [formData, setFormData] = useState({
    userId: "temp-user-id",
    email: "",
    weekly_km: "",
    trip_length: "",
    driving_frequency: "",
    driving_type: "",
    road_trips: "",
    car_ownership: "",
    fuel_efficiency: "",
    monthly_fuel_spend: "",
    home_charging: "",
    solar_panels: "",
    charging_preference: "",
    budget: "",
    priorities: "",
    postcode: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    //console.log(name + ": " + value);
  };

  const [inputs, setInputs] = useState({
    affordability: false,
    driving_range: false,
    environmental_impact: false,
    charging_convenience: false,
    tech_features: false,
    brand_design: false,
  });

  const handleCheckChange = (e) => {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    setInputs(values => ({...values, [name]: value}))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const priorities = [];
    if (inputs.affordability) {priorities.push("Affordability")}
    if (inputs.driving_range) {priorities.push("Driving range")}
    if (inputs.environmental_impact) {priorities.push("Environmental impact")}
    if (inputs.charging_convenience) {priorities.push("Charging convenience")}
    if (inputs.tech_features) {priorities.push("Tech features")}
    if (inputs.brand_design) {priorities.push("Brand/ design")}
    formData.priorities = priorities.join(", ")
    console.log(formData.priorities);
      

    // const payload = {
    //   // userId: "Strawberry",
    //   // email: "strawberry@jam.com",
    //   weekly_km: 153,
    //   trip_length: "Mostly medium trips (10-50 km)",
    //   driving_frequency: "Daily",
    //   driving_type: "A mix of city/suburban and highway driving",
    //   road_trips: "No",
    //   car_ownership: "Yes - Petrol",
    //   fuel_efficiency: 7.9,
    //   monthly_fuel_spend: 84.32,
    //   home_charging: "Yes",
    //   solar_panels: "Yes",
    //   charging_preference: "Home",
    //   budget: "<$40,000",
    //   priorities: "Cost savings, Environmental impact",
    //   postcode: "3095",
    //   //cluster: null
    //   // createdAt: Date,
    //   // updatedAt: Date
    // }

    const payload = {
      weekly_km: formData.weekly_km,
      trip_length: formData.trip_length,
      driving_frequency: formData.driving_frequency,
      driving_type: formData.driving_type,
      road_trips: formData.road_trips,
      car_ownership: formData.car_ownership,
      fuel_efficiency: formData.fuel_efficiency,
      monthly_fuel_spend: formData.monthly_fuel_spend,
      home_charging: formData.home_charging,
      solar_panels: formData.solar_panels,
      charging_preference: formData.charging_preference,
      budget: formData.budget,
      priorities: formData.priorities,
      postcode: formData.postcode,
    }

    // if (!formData.fullName || !formData.email) {
    //   setMessage("Please fill in the required fields.");
    //   return;
    // }

    try {
      setLoading(true);
      setMessage("");

      //await axios.post("http://localhost:8080/api/insights/submit", formData);
      const response = await submitInsights(payload, token);

      setMessage("Form submitted successfully.");

      setFormData({
        userId: "temp-user-id",
        email: "",
        weekly_km: "",
        trip_length: "",
        driving_frequency: "",
        driving_type: "",
        road_trips: "",
        car_ownership: "",
        fuel_efficiency: "",
        monthly_fuel_spend: "",
        home_charging: "",
        solar_panels: "",
        charging_preference: "",
        budget: "",
        priorities: "",
        postcode: ""
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
              <h3 className="insights-section-title">User Details</h3>

              <div className="form-section">
                <label className="form-label required">User ID</label>
                <input
                  type="text"
                  name="userId"
                  placeholder="Enter user ID"
                  value={formData.userId}
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

              <h3 className="insights-section-title">Driving Details</h3>

              <div className="form-section">
                <label className="form-label required">Weekly KM</label>
                <input
                  type="number"
                  name="weekly_km"
                  placeholder="e.g. 250"
                  value={formData.weekly_km}
                  onChange={handleChange}
                />
              </div>

              <div className="form-section">
                <label className="form-label required">Typical Trip Length</label>
                <select
                  name="trip_length"
                  value={formData.trip_length}
                  onChange={handleChange}
                >
                  <option value="">Select trip length</option>
                  <option value="Mostly short trips (<10 km)">Short</option>
                  <option value="Mostly medium trips (10-50 km)">Medium</option>
                  <option value="Mostly long trips (>50 km)">Long</option>
                </select>
              </div>

              <div className="form-section">
                <label className="form-label required">Driving Frequency</label>
                <select
                  name="driving_frequency"
                  value={formData.driving_frequency}
                  onChange={handleChange}
                >
                  <option value="">Select driving frequency</option>
                  <option value="Daily">Daily</option>
                  <option value="A few times a week">Few times a week</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Occasionally">Occasionally</option>
                </select>
              </div>

              <div className="form-section">
                <label className="form-label required">Driving Type</label>
                <select
                  name="driving_type"
                  value={formData.driving_type}
                  onChange={handleChange}
                >
                  <option value="">Select driving type</option>
                  <option value="Mostly inner-city or suburban driving (short distances/stop-start traffic)">Inner-city or suburban</option>
                  <option value="Mostly highway or regional driving (longer distances/higher speeds)">Highways or regional</option>
                  <option value="A mix of city/suburban and highway driving">Suburban and highways</option>
                  <option value="Mostly rural or remote area driving (long distances/variable road conditions)">Rural or remote</option>
                </select>
              </div>

              <div className="form-section">
                <label className="form-label required">Do you regularly go on long road trips?</label>
                <select
                  name="road_trips"
                  value={formData.road_trips}
                  onChange={handleChange}
                >
                  <option value="">Select option</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div className="form-section">
                <label className="form-label required">Do you own a vehicle</label>
                <select
                  name="car_ownership"
                  value={formData.car_ownership}
                  onChange={handleChange}
                >
                  <option value="">Select ownership</option>
                  <option value="Yes - Petrol">Petrol</option>
                  <option value="Yes - Diesel">Diesel</option>
                  <option value="Yes - Hybrid">Hybrid</option>
                  <option value="Yes - Electric">Electric</option>
                  <option value="No - I don't own a car">No car</option>
                </select>
              </div>
            </div>

            <div>
              <h3 className="insights-section-title">Fuel and Charging</h3>

              <div className="form-section">
                <label className="form-label required">Fuel Efficiency (L/100km)</label>
                <input
                  type="number"
                  name="fuel_efficiency"
                  placeholder="e.g. 7.5"
                  value={formData.fuel_efficiency}
                  onChange={handleChange}
                />
              </div>

              <div className="form-section">
                <label className="form-label required">Monthly Fuel Spend ($)</label>
                <input
                  type="number"
                  name="monthly_fuel_spend"
                  placeholder="e.g. 300"
                  value={formData.monthly_fuel_spend}
                  onChange={handleChange}
                />
              </div>

              <div className="form-section">
                <label className="form-label required">Is Home Charging Accessible</label>
                <select
                  name="home_charging"
                  value={formData.home_charging}
                  onChange={handleChange}
                >
                  <option value="">Select option</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                  <option value="Not sure">Not sure</option>
                </select>
              </div>

              <div className="form-section">
                <label className="form-label required">Does Your Home Have Solar Panels</label>
                <select
                  name="solar_panels"
                  value={formData.solar_panels}
                  onChange={handleChange}
                >
                  <option value="">Select option</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div className="form-section">
                <label className="form-label required">Charging Location Preference</label>
                <select
                  name="charging_preference"
                  value={formData.charging_preference}
                  onChange={handleChange}
                >
                  <option value="">Select preference</option>
                  <option value="Home">Home</option>
                  <option value="Work">Work</option>
                  <option value="Public stations">Public charging</option>
                  <option value="No Preference">No Preference</option>
                </select>
              </div>

              <h3 className="insights-section-title">EV Preference</h3>

              <div className="form-section">
                <label className="form-label required">Budget</label>
                <select
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                >
                  <option value="">Select budget</option>
                  <option value="<$40,000">Under $40k</option>
                  <option value="$40,000-$60,000">$40k - $60k</option>
                  <option value="$60,000-$80,000">$60k - $80k</option>
                  <option value=">$80,000">Over 80k$</option>
                  <option value="Not sure/ Just exploring">Not sure / Just exploring</option>
                </select>
              </div>

              <div className="form-section">
                <label className="form-label required">Priorities</label>
                {/* <select
                  name="priorities"
                  value={formData.priorities}
                  onChange={handleChange}
                >
                  <option value="">Select priority</option>
                  <option value="Cost savings">Cost savings</option>
                  <option value="Environmental impact">Environmental impact</option>
                  <option value="Performance">Performance</option>
                  <option value="Low maintenance">Low maintenance</option>
                </select> */}
                <div className="checkbox, input-and-label-same-line">
                  <input 
                    name="affordability"
                    type="checkbox"
                    id="priorities1"
                    value="Affordability"
                    checked={inputs.affordability}
                    onChange={handleCheckChange} />
                  <label for="priorities1">Affordability</label>
                  <input 
                    name="driving_range" 
                    type="checkbox" 
                    id="priorities2" 
                    value="Driving range" 
                    checked={inputs.driving_range} 
                    onChange={handleCheckChange} />
                  <label for="priorities2">Driving range</label>
                  <input 
                    name="environmental_impact" 
                    type="checkbox" 
                    id="priorities3" 
                    value="Environmental impact" 
                    checked={inputs.environmental_impact} 
                    onChange={handleCheckChange} />
                  <label for="priorities3">Environmental Impact</label>
                  <input 
                    name="charging_convenience" 
                    type="checkbox" id="priorities4" 
                    value="Charging convenience" 
                    checked={inputs.charging_convenience} 
                    onChange={handleCheckChange} />
                  <label for="priorities4">Charging Convenience</label>
                  <input
                    name="tech_features" 
                    type="checkbox"
                    id="priorities5"
                    value="Tech features" 
                    checked={inputs.tech_features} 
                    onChange={handleCheckChange} />
                  <label for="priorities5">Tech Features</label>
                  <input 
                    name="brand_design" 
                    type="checkbox" 
                    id="priorities6" 
                    value="Brand/ design" 
                    checked={inputs.brand_design} 
                    onChange={handleCheckChange} />
                  <label for="priorities6">Brand/Design</label>
                </div>
              </div>

              <div className="form-section">
                <label className="form-label required">Postcode</label>
                <input
                  type="text"
                  name="postcode"
                  placeholder="Enter postcode"
                  value={formData.postcode}
                  onChange={handleChange}
                />
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