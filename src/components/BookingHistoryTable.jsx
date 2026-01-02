// NOTE: Booking data are saved in the backend and currently displayed all in here.

// Future ideas: clear table (frontend only), or paginate (e.g. 10 per page),
// limit bookings to be seen based on amount/time,
// link station names to details.

import React, { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL

export default function BookingHistoryTable() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  const getUserId = () => {
    const raw = localStorage.getItem("currentUser");
    if (!raw) return null;
    try {
      const u = JSON.parse(raw);
      return u?.id || u?._id || null;
    } catch {
      return null;
    }
  };

  async function fetchBookings() {
    setLoading(true);
    setError("");

    try {
      const userId = getUserId();
      if (!userId) {
        setBookings([]);
        setError("Please sign in to view your bookings.");
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_URL}/bookings/me`, {
        headers: { "x-user-id": String(userId) },
      });
      const data = await res.json().catch(() => ([]));
      if (!res.ok) throw new Error(data?.error || data?.message || `Failed (${res.status})`);

      const rows = (Array.isArray(data) ? data : []).map((b) => {
        const dt = b.datetime ? new Date(b.datetime) : null;
        const created = b.createdAt ? new Date(b.createdAt) : null;

        const yyyy = dt ? dt.getFullYear() : "";
        const mm   = dt ? String(dt.getMonth() + 1).padStart(2, "0") : "";
        const dd   = dt ? String(dt.getDate()).padStart(2, "0") : "";
        const hh   = dt ? String(dt.getHours()).padStart(2, "0") : "";
        const min  = dt ? String(dt.getMinutes()).padStart(2, "0") : "";

        const bookedAt =
          created
            ? `${created.getFullYear()}-${String(created.getMonth() + 1).padStart(2, "0")}-${String(created.getDate()).padStart(2, "0")} ${String(created.getHours()).padStart(2, "0")}:${String(created.getMinutes()).padStart(2, "0")}`
            : "-";

        return {
          id: b.reference || b._id || "N/A",
          station: b.stationName || b.station || "-",
          date: dt ? `${yyyy}-${mm}-${dd}` : "-",
          time: dt ? `${hh}:${min}` : "-",
          bookedAt,
          notes: b.notes || "-",
          access_key_required: "false",
        };
      });

      setBookings(rows);
    } catch (e) {
      setError(e.message || "Failed to load bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) return <p>Loading bookings…</p>;
  if (error)   return <p style={{ color: "red" }}>{error}</p>;
  if (bookings.length === 0) return <p>No bookings yet.</p>;

  return (
    <div className="table-wrapper center">
      <table className="table">
        <thead>
          <tr>
            <th>Station</th>
            <th>Booking Date</th>
            <th>Booking Time</th>
            <th>Booked At</th>
            <th>Notes</th>
            <th>Booking Ref</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr
              key={b.id}
              className={`table-row ${b.access_key_required === "true" ? "restricted" : "open"}`}
            >
              <td className="table-col-left">{b.station}</td>
              <td className="table-col-center">{b.date}</td>
              <td className="table-col-center">{b.time}</td>
              <td className="table-col-center">{b.bookedAt}</td>
              <td className="table-col-left small-cell">{b.notes}</td>
              <td className="table-col-right">{b.id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}