import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";

import "../styles/SideBarBookingTool.css";

const API_URL = import.meta.env.VITE_API_URL
const BOOKING_ENDPOINT = `${API_URL}/bookings`;
const NOTES_MAX_LENGTH = 100;   // this should be changed to match the character limit of the notes string in the database
const RECENT_BOOKING_THRESHOLD_SECONDS = 30;

export default function SidebarBookingTool({ stationName = "Unknown Station" }) {
  const [user, setUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [vehicle, setVehicle] = useState("");
  const [notes, setNotes] = useState("");
  const [agree, setAgree] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [recentBookingWarning, setRecentBookingWarning] = useState(false);

  useEffect(() => {
    // load current user
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

  // auto-clear the warning after 30 seconds so it doesn't linger forever
  useEffect(() => {
    if (recentBookingWarning) {
      const timer = setTimeout(() => {
        setRecentBookingWarning(false);
      }, RECENT_BOOKING_THRESHOLD_SECONDS * 1000);
      return () => clearTimeout(timer);
    }
  }, [recentBookingWarning]);

  // notes remaining characters
  const notesRemaining = NOTES_MAX_LENGTH - notes.length;

  // checks if the selected datetime in the past
  const isPastDateTime = () => {
    const chosen = combineDateTime();
    if (!chosen) return false;
    return chosen <= new Date();
  };

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
    // check for recent booking (anti-spam)
    const lastBooking = localStorage.getItem("lastBooking");
    if (lastBooking) {
      try {
        const { createdAt } = JSON.parse(lastBooking);
        const secondsAgo = (Date.now() - new Date(createdAt)) / 1000;
        // if the bookings are close together
        if (secondsAgo < RECENT_BOOKING_THRESHOLD_SECONDS) {
          setRecentBookingWarning(true);
          toast.warn("Please wait a moment before making another booking.",
          { 
            toastId: "anti-spam",
            autoClose: 5000,
            position: "top-center"
          });
          return; // block the booking attempt
        }
      } catch {}
    }

    // check selected date is valid
    if (isPastDateTime()) {
      toast.error("You cannot book a time in the past.", { position: "top-center" });
      return;
    }

    // check if there is a time and date selected
    const dateTime = combineDateTime();
    if (!dateTime || !agree) return;

    // check user id exists
    const userId = user?.id || user?._id;
    if (!userId) {
      toast.error("Please sign in first.", { position: "top-center" });
      return;
    }

    // create payload for request
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

      // add item to local storage
      localStorage.setItem(
        "lastBooking",
        JSON.stringify({ 
          ...payload, 
          serverId, 
          reference, 
          createdAt: new Date().toISOString() 
        })
      );

      // successful booking
      toast.success(
        <div>
          Booking confirmed!
          <br />
          Reference: {String(reference)}
        </div>,
        { 
          position: "top-center", 
          autoClose: 1000, 
          closeOnClick: true, 
          draggable: true, 
          closeButton: true, 
          toastId: "booking-success" }
      );

      // reset form
      setSelectedDate(null);
      setSelectedTime(null);
      setVehicle("");
      setNotes("");
      setAgree(false);
      setRecentBookingWarning(false);
    } catch {
      toast.error("Network error while booking", { position: "top-center" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="input-and-label-same-line">
        {/* date picker */}
        <label>Date</label>
        <DatePicker
          className="date-picker"
          popperPlacement="right"
          selected={selectedDate}
          onChange={(d) => setSelectedDate(d)}
          dateFormat="yyyy-MM-dd"
          minDate={new Date()}
          placeholderText="YYYY-MM-DD"
        />
      </div>
      <div className="input-and-label-same-line">
        {/* time picker */}
        <label>Time</label>
        <DatePicker
          popperPlacement="right"
          selected={selectedTime}
          onChange={(t) => setSelectedTime(t)}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={15}
          timeCaption="Time"
          dateFormat="hh:mm aa"
          placeholderText="hh:mm"
        />
      </div>
      <div>
        {/* warning if selected date and time is in the past */}
        {selectedDate && selectedTime && isPastDateTime() && (
          <div className="validation-error">
            Selected time is in the past
          </div>
        )}
      </div>
      <div>
        {/* notes text area - does not accept characters past the limit */}
        <label>
          Notes (optional) - <span className="text-tiny">{notesRemaining} characters remaining</span>
        </label>
        <textarea 
          className="full-width"
          value={notes} 
          onChange={(e) => setNotes(e.target.value.slice(0, NOTES_MAX_LENGTH))} // cut the string at the max length
          placeholder="Any notes..." 
          rows={3}
        />
      </div>

      {/* agree to booking terms checkbox */}
      <label className="checkbox">
        <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
        <span className="text-small font-italic">I agree to booking terms</span>
      </label>

      {/* recent booking warning */}
      {recentBookingWarning && (
        <div className="validation-error">
            Please wait a few seconds before booking again.
        </div>
      )}

      {/* confirm booking button */}
      <button
        className="btn btn-primary uppercase btn-full btn-small"
        onClick={handleConfirm}
        disabled={!selectedDate || !selectedTime || !agree || submitting || isPastDateTime()}
      >
        {submitting ? "Submitting..." : "Confirm Booking"}
      </button>
    </div>
  );
}