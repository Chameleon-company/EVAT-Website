import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Background from "../components/Background";
import "../styles/Booking.css";
import { useLocation } from "react-router-dom";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function BookingTool() {
  const navigate = useNavigate();


const location = useLocation();
const station = location.state?.station; // station details from sidebar

  const [user, setUser] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const [step, setStep] = useState(0); // start at Date&Time

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [dateTimeObj, setDateTimeObj] = useState(null);
  const [vehicle, setVehicle] = useState("");
  const [notes, setNotes] = useState("");
  const [agree, setAgree] = useState(false);

  useEffect(() => {
    const u = localStorage.getItem("currentUser");
    if (u) {
      try {
        setUser(JSON.parse(u));
      } catch {
        setUser({ firstName: "Guest", lastName: "", email: "guest@example.com" });
        setIsGuest(true);
      }
    } else {
      setUser({ firstName: "Guest", lastName: "", email: "guest@example.com" });
      setIsGuest(true);
    }
  }, []);

  const canNext =
    (step === 0 && !!date && !!time) ||
    (step === 1 && !!vehicle && agree);

  const next = () => setStep((s) => Math.min(s + 1, 2));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const confirm = () => {
    const confirmation = {
      id: "BK-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
      date,
      time,
      vehicle,
      notes,
      userEmail: user?.email,
      createdAt: new Date().toISOString(),
      isGuest,
    };
    localStorage.setItem("lastBooking", JSON.stringify(confirmation));
    alert(`Booking confirmed!\nRef: ${confirmation.id}`);
    navigate("/profile");
  };

  return (
    <div className="dashboard-page">
      <NavBar />
      <Background>
  <div className="booking-scroll" style={{ padding: '1rem', width: '100%' }}>

          <h1>Booking</h1>

{/* show selected charger if you came from the Map sidebar */}
{station && (
  <div className="selected-station" style={{marginBottom: '1rem'}}>
    <h3 style={{margin: 0}}>Booking for: {station.operator || "Unknown Operator"}</h3>
    <p style={{margin: '4px 0'}}>Type: {station.connection_type || "N/A"}</p>
    <p style={{margin: 0}}>Power: {station.power_output || "N/A"} kW</p>
  </div>
)}


  ...

          {/* Tab bar */}
          <div className="tabbar">
            <button
              className={`tab ${step === 0 ? "active" : ""}`}
              onClick={() => setStep(0)}
            >
              Date &amp; Time
            </button>
            <button
              className={`tab ${step === 1 ? "active" : ""}`}
              onClick={() => setStep(1)}
            >
              Details
            </button>
            <button
              className={`tab ${step === 2 ? "active" : ""}`}
              onClick={() => setStep(2)}
            >
              Confirmations
            </button>
          </div>

          {/* Date & Time */}
          {step === 0 && (
            <div className="dt-row">
              <DatePicker
                selected={dateTimeObj}
                onChange={(d) => {
                  setDateTimeObj(d);
                  if (d) {
                    const yyyy = d.getFullYear();
                    const mm = String(d.getMonth() + 1).padStart(2, "0");
                    const dd = String(d.getDate()).padStart(2, "0");
                    const hh = String(d.getHours()).padStart(2, "0");
                    const min = String(d.getMinutes()).padStart(2, "0");
                    setDate(`${yyyy}-${mm}-${dd}`);
                    setTime(`${hh}:${min}`);
                  } else {
                    setDate("");
                    setTime("");
                  }
                }}
                inline
                showTimeSelect
                timeIntervals={15}
                dateFormat="MMMM d, yyyy h:mm aa"
                minDate={new Date()}
                className="booking-inline-datepicker"
              />

              <div className="dt-summary">
                <label>Date &amp; Time</label>
                <div className="summary-box">
                  {date && time
                    ? `${new Date(date).toLocaleDateString()} • ${time}`
                    : "—"}
                </div>
                <button className="next-btn" disabled={!canNext} onClick={next}>
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Details */}
          {step === 1 && (
            <div className="dt-summary">
              <label>Vehicle</label>
              <input
                type="text"
                placeholder="e.g., Tesla Model 3"
                value={vehicle}
                onChange={(e) => setVehicle(e.target.value)}
              />

              <label>Notes</label>
              <textarea
                placeholder="Any extra notes?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />

              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                />
                <span>I agree to the booking terms</span>
              </label>

              <div style={{ marginTop: "10px" }}>
                <button className="next-btn" onClick={back}>
                  Back
                </button>
                <button className="next-btn" disabled={!canNext} onClick={next}>
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Confirmation */}
          {step === 2 && (
            <div className="dt-summary">
              <h3>Confirm Your Booking</h3>
              <p>
                <strong>Date:</strong> {date} <br />
                <strong>Time:</strong> {time} <br />
                <strong>Vehicle:</strong> {vehicle} <br />
                <strong>Notes:</strong> {notes || "—"}
              </p>

              <div style={{ marginTop: "10px" }}>
                <button className="next-btn" onClick={back}>
                  Back
                </button>
                <button className="next-btn" onClick={confirm}>
                  Confirm Booking
                </button>
              </div>
            </div>
          )}
        </div>
      </Background>
    </div>
  );
}

