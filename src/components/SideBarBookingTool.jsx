import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/SideBarBookingTool.css";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL
const BOOKING_ENDPOINT = `${API_URL}/bookings`;
const NOTES_MAX_LENGTH = 100;   // this should be changed to match the character limit of the notes string in the database

export default function SidebarBookingTool({ stationName = "Unknown Station" }) {
  const [user, setUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [vehicle, setVehicle] = useState("");
  const [notes, setNotes] = useState("");
  const [agree, setAgree] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const u = localStorage.getItem("currentUser");
    if (u) {
      try {
        setUser(JSON.parse(u));
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  // notes remaining characters
  const notesRemaining = NOTES_MAX_LENGTH - notes.length;

  // combines data and time into one date object
  const combineDateTime = () => {
    if (!selectedDate || !selectedTime) return null;
    const combined = new Date(selectedDate);
    combined.setHours(selectedTime.getHours());
    combined.setMinutes(selectedTime.getMinutes());
    combined.setSeconds(0);
    combined.setMilliseconds(0);
    return combined;
  };

  // confirm booking
  const handleConfirm = async () => {
    const dateTime = combineDateTime();
    if (!dateTime || !agree) return;

    const userId = user?.id || user?._id;
    if (!userId) {
      toast.error("Please sign in first.", { position: "top-center" });
      return;
    }

    const payload = {
      userId,
      datetime: dateTime.toISOString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      tzOffsetMinutes: new Date().getTimezoneOffset(),
      vehicle: vehicle || undefined,
      notes: notes.trim() || undefined,
      stationName,
    };

    setSubmitting(true);
    try {
      const res = await fetch(BOOKING_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": String(userId),
        },
        body: JSON.stringify(payload),
      });

      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(body?.error || body?.message || `Booking failed (${res.status})`, {
          position: "top-center",
        });
        return;
      }

      const serverId = body.id || body._id || "N/A";
      const reference = body.reference || serverId;

      localStorage.setItem(
        "lastBooking",
        JSON.stringify({ ...payload, serverId, reference, createdAt: new Date().toISOString() })
      );

      toast.success(
        <div>
          Booking confirmed!
          <br />
          Reference: {String(reference)}
        </div>,
        { position: "top-center", autoClose: 1000, closeOnClick: true, draggable: true, closeButton: true, toastId: "booking-success" }
      );

      // reset form
      setSelectedDate(null);
      setSelectedTime(null);
      setVehicle("");
      setNotes("");
      setAgree(false);
    } catch {
      toast.error("Network error while booking", { position: "top-center" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="sidebar-booking">
      <label>Date</label>
      <DatePicker
        selected={selectedDate}
        onChange={(d) => setSelectedDate(d)}
        dateFormat="yyyy-MM-dd"
        minDate={new Date()}
        placeholderText="Pick a date"
        className="booking-datepicker"
      />

      <label>Time</label>
      <DatePicker
        selected={selectedTime}
        onChange={(t) => setSelectedTime(t)}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={15}
        timeCaption="Time"
        dateFormat="h:mm aa"
        placeholderText="Pick a time"
        className="booking-datepicker"
      />
      
      {/* notes text area - does not accept characters past the limit */}
      <label>
        Notes (optional) – {notesRemaining} characters remaining
      </label>
      <textarea 
        value={notes} 
        onChange={(e) => setNotes(e.target.value.slice(0, NOTES_MAX_LENGTH))} // cut the string at the max length
        placeholder="Any notes..." 
        rows={3}
      />

      <label className="checkbox">
        <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
        <span>I agree to booking terms</span>
      </label>

      <button
        className="book-button"
        onClick={handleConfirm}
        disabled={!selectedDate || !selectedTime || !agree || submitting}
      >
        {submitting ? "Submitting..." : "Confirm Booking"}
      </button>
    </div>
  );
}