// NOTE: For security reasons, card payment details are NOT stored in the backend.

// This section only saves card information locally in the browser.
// Full backend integration can be implemented
// in the future when actual payments need to be made.

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import NavBar from '../components/NavBar';
import profileImage from '../assets/profileImage.png';
import ChatBubble from "../components/ChatBubble";
import BookingHistoryTable from "../components/BookingHistoryTable";

import '../styles/Buttons.css';
import '../styles/Fonts.css';
import '../styles/Forms.css';
import '../styles/Elements.css';

const API_URL = import.meta.env.VITE_API_URL;

function Profile() {
  const navigate = useNavigate();
  const location = useLocation();

  // Local state management
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [editingCar, setEditingCar] = useState(false);
  const [editingPayment, setEditingPayment] = useState(false);
  const [editingAbout, setEditingAbout] = useState(false);
  const [history, setHistory] = useState([]);

  // New state for car dropdowns
  const [allVehicles, setAllVehicles] = useState([]);
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [years, setYears] = useState([]);

  // Reset tab to "dashboard" if user navigates back with reset flag
  useEffect(() => {
    if (location.pathname === "/profile") {
      if (location.state?.resetDashboard) {
        setActiveTab("dashboard");
        navigate(location.pathname, { replace: true });
      }
    }
  }, [location, navigate]);

  const storedUser = JSON.parse(localStorage.getItem('currentUser'));
  const token = storedUser?.token;

  // Fetch user profile on load
  useEffect(() => {
    if (!token) {
      navigate('/signin');
      return;
    }

    const fetchUserProfile = async () => {
      try {
        // Fetch basic user profile (id, name, email, mobile, role)
        const authRes = await fetch(`${API_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!authRes.ok) throw new Error("Failed to fetch auth profile");
        const authData = await authRes.json();

        // Fetch detailed profile (car model, favourite stations)
        const profileRes = await fetch(`${API_URL}/profile/user-profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!profileRes.ok) throw new Error("Failed to fetch user profile details");
        const profileData = await profileRes.json();

        // Normalize car for the UI
        let car = profileData?.data?.user_car_model ?? null;

        if (car && typeof car === "string") {
          // car is an ID - fetch full vehicle
          const vRes = await fetch(`${API_URL}/vehicle/${car}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (vRes.ok) {
            const v = await vRes.json();
            car = {
              ...v,
              id: v.id || v._id,
              year: v.year || v.model_release_year,
            };
          } else {
            car = null;
          }
        } else if (car && typeof car === "object") {
          // car is an object - normalize fields
          car = {
            ...car,
            id: car.id || car._id,
            year: car.year || car.model_release_year,
          };
        }

        const nextUser = {
          id: authData.data.id,
          firstName: authData.data.firstName || "",
          lastName: authData.data.lastName || "",
          email: authData.data.email || "",
          mobile: authData.data.mobile || "",
          role: authData.data.role || "",
          car,
          favourites: profileData.data.favourite_stations || [],
          token: token,
        };

        setUser(nextUser);
        localStorage.setItem("currentUser", JSON.stringify(nextUser));
      } catch (err) {
        console.error("Profile fetch error:", err);
        navigate('/signin');
      }
    };

    fetchUserProfile();
  }, [navigate, token]);

  useEffect(() => {
    if (editingCar) {
      fetch(`${API_URL}/vehicle`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      })
        .then(res => res.json())
        .then(data => {
          const items = (data.data || []).map(v => ({
            ...v,
            id: v.id || v._id,
            year: v.year || v.model_release_year,
          }));
          setAllVehicles(items);
          setMakes(["Select", ...new Set(items.map(v => v.make))]);
        })
        .catch(err => console.error("Failed to load vehicles:", err));
    }
  }, [editingCar, user?.token]);

  // Fetch all vehicles when editing starts (to populate dropdown list)
  useEffect(() => {
    if (user?.car?.make) {
      const filteredModels = allVehicles
        .filter(v => v.make === user.car.make)
        .map(v => v.model);
      setModels(["Select", ...new Set(filteredModels)]);

      if (user?.car?.model) {
        const filteredYears = allVehicles
          .filter(v => v.make === user.car.make && v.model === user.car.model)
          .map(v => v.year)
          .filter(Boolean);
        setYears(["Select", ...new Set(filteredYears.map(String))]);
      } else {
        setYears(["Select"]);
      }
    } else {
      setModels(["Select"]);
      setYears(["Select"]);
    }
  }, [user?.car?.make, user?.car?.model, allVehicles]);

  // Reset editing states when switching tabs
  useEffect(() => {
    if (activeTab !== "payment") setEditingPayment(false);
    if (activeTab !== "car") setEditingCar(false);
    if (activeTab !== "about") setEditingAbout(false);
  }, [activeTab]);

  const handleSignOut = () => {
    localStorage.removeItem('currentUser');
    navigate("/signin");
  };

  // To make sure mobile follows Au format
  const isValidMobile = (mobile) => {
    // Starts with 04 and has 10 digits total
    const regex = /^04\d{8}$/;
    return regex.test(mobile);
  };

  const handleSaveAbout = async () => {
    try {
      if (!isValidMobile(user.mobile)) {
        alert("Invalid mobile number. It must be 10 digits and start with 04.");
        return;
      }

      const payload = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        mobile: user.mobile,
      };
  
      const response = await fetch(`${API_URL}/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to update profile info");

      setEditingAbout(false);
      alert("Profile information updated successfully!");
    } catch (err) {
      console.error(err);
      alert(`Failed to update profile: ${err.message}`);
    }
  };

  const handleSaveCar = async () => {
    try {
      const token = user?.token;

      // The car selected must exist in allVehicles (from /api/vehicle)
      const selectedVehicle = allVehicles.find(
        v =>
          v.make === user.car?.make &&
          v.model === user.car?.model &&
          String(v.model_release_year || v.year) === String(user.car?.year)
      );

      if (!selectedVehicle) {
        alert("Invalid vehicle selection");
        return;
      }

      const payload = {
        vehicleId: selectedVehicle.id, // API requires only this
      };
  
      const response = await fetch(`${API_URL}/profile/vehicle-model`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to update vehicle");

      const data = await response.json();

      // Update user state with the selected vehicle
      const normalizedCar = {
        ...selectedVehicle,
        id: selectedVehicle.id ?? selectedVehicle._id ?? vehicleId,
        year: selectedVehicle.year ?? selectedVehicle.model_release_year ?? null,
      };

      setUser(prev => {
        const next = { ...prev, car: normalizedCar };
        localStorage.setItem("currentUser", JSON.stringify(next));
        return next;
      });

      setEditingCar(false);
      alert("Vehicle updated successfully!");
    } catch (err) {
      console.error(err);
      alert(`Failed to update vehicle: ${err.message}`);
    }
  };

  const handleSavePayment = () => {
    // Remove spaces for validation
    const cardNum = (user.cardNumber || "").replace(/\s+/g, '');
    if (!/^\d{16}$/.test(cardNum)) {
      alert("Card number must be 16 digits.");
      return;
    }

    if (!/^\d{3}$/.test(user.cvv || "")) {
      alert("CVV must be 3 digits.");
      return;
    }

    // Validate expiry date to have MM/YY format
    const expRegex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
    if (!user.expiryDate || !expRegex.test(user.expiryDate)) {
      alert("Expiry date must be in MM/YY format.");
      return;
    }

    // Check if expiry date is in the future
    const [inputMonth, inputYear] = user.expiryDate.split("/").map(s => parseInt(s, 10));
    const now = new Date();
    const currentYear = now.getFullYear() % 100; // last 2 digits
    const currentMonth = now.getMonth() + 1; // 0-indexed

    if (inputYear < currentYear || (inputYear === currentYear && inputMonth < currentMonth)) {
      alert("Card has expired. Please enter a valid card detail.");
      return;
    }

    // Save locally
    setUser(prev => {
      const next = { ...prev, cardNumber: cardNum };
      localStorage.setItem("currentUser", JSON.stringify(next));
      return next;
    });

    setEditingPayment(false);
    alert("Payment information updated locally.");
  };

  if (!user) return null;

  return (
    <div>
      <NavBar />
      {/* background */}
      <div className="background-image" />
      {/* title */}
      <h1 className='h1 text-center auto-width'>My Dashboard</h1>
      <div className="container auto-width">
        {/* left container - profile image*/}
        <div className="container-left">
          <div className="profile-image">
            <img src={profileImage} alt="Profile" />
          </div>
        </div>
        {/* center container - options and details*/}
        <div className="container-center">
          {activeTab === "dashboard" && (
            <>
              <button className="btn btn-primary two-hundred-width" onClick={() => setActiveTab("about")}>About Me</button>
              <button className="btn btn-primary two-hundred-width" onClick={() => setActiveTab("car")}>My Car</button>
              <button className="btn btn-primary two-hundred-width" onClick={() => setActiveTab("payment")}>Payment</button>
              <button className="btn btn-primary two-hundred-width" onClick={() => setActiveTab("history")}>Booking History</button>
            </>
          )}

          {activeTab === "about" && (
            <div>
              <h3>About Me</h3>
              <div>
                <p>First Name:{" "}
                  {editingAbout ? (
                    <input
                      type="text"
                      value={user.firstName || ""}
                      onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                    />
                  ) : (user.firstName)}
                </p>
                <p>Last Name:{" "}
                  {editingAbout ? (
                    <input
                      type="text"
                      value={user.lastName || ""}
                      onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                    />
                  ) : (user.lastName)}
                </p>
                <p>Email: {user.email || "N/A"}</p>
                <p>Phone:{" "}
                  {editingAbout ? (
                    <input
                      type="text"
                      value={user.mobile || ""}
                      onChange={(e) => setUser({ ...user, mobile: e.target.value })}
                    />
                  ) : (user.mobile || "N/A")}
                </p>
              </div>
            </div>
          )}

          {activeTab === "car" && (
            <div>
              <h3>My Car</h3>
              <div>
                <p>Car Make:{" "}
                  {editingCar ? (
                    <select
                      value={user.car?.make || "Select"}
                      onChange={(e) =>
                        setUser({ ...user, car: { ...user.car, make: e.target.value, model: "", year: "" } })
                      }
                    >
                      {makes.map((make, idx) => (
                        <option key={idx} value={make}>
                          {make}
                        </option>
                      ))}
                    </select>
                  ) : (user.car?.make || "N/A")}
                </p>
                <p>Car Model:{" "}
                  {editingCar ? (
                    <select
                      value={user.car?.model || "Select"}
                      onChange={(e) =>
                        setUser({ ...user, car: { ...user.car, model: e.target.value, year: "" } })
                      }
                    >
                      {models.map((model, idx) => (
                        <option key={idx} value={model}>
                          {model}
                        </option>
                      ))}
                    </select>
                  ) : (user.car?.model || "N/A")}
                </p>
                <p>Model Year:{" "}
                  {editingCar ? (
                    <select
                      value={String(user.car?.year) || "Select"}
                      onChange={(e) =>
                        setUser({ ...user, car: { ...user.car, year: e.target.value } })
                      }
                    >
                      {years.map((year, idx) => (
                        <option key={idx} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  ) : (user.car?.year || "N/A")}
                </p>
              </div>
            </div>
          )}

          {activeTab === "payment" && (
            <div>
              <h3>Payment Information</h3>
              <div>
                <p>Card:{" "}
                  {editingPayment ? (
                    <input
                      type="text"
                      value={user.cardNumber || ""}
                      onChange={(e) => {
                        // Only digits, max 16
                        let val = e.target.value.replace(/\D/g, '').slice(0, 16);
                        // Add spaces every 4 digits for display
                        val = val.replace(/(\d{4})(?=\d)/g, '$1 ');
                        setUser({ ...user, cardNumber: val });
                      }}
                      placeholder="1234 5678 9012 3456"
                    />
                  ) : (user.cardNumber
                      ? "**** **** **** " + user.cardNumber.replace(/\s/g, '').slice(-4)
                      : "**** **** **** 1234"
                  )}
                </p>
                <p>Expiry Date:{" "}
                  {editingPayment ? (
                    <input
                      type="text"
                      value={user.expiryDate || ""}
                      onChange={(e) => {
                        let val = e.target.value.replace(/\D/g, '').slice(0, 4); // digits only, max 4
                        if (val.length > 2) val = val.slice(0, 2) + '/' + val.slice(2); // insert '/'
                        setUser({ ...user, expiryDate: val });
                      }}
                      placeholder="MM/YY"
                    />
                  ) : (user.expiryDate || "MM/YY")}
                </p>
                <p>CVV:{" "}
                  {editingPayment ? (
                    <input
                      type="text"
                      value={user.cvv || ""}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 3);
                        setUser({ ...user, cvv: val });
                      }}
                      placeholder="123"
                    />
                  ) : ("***")}
                </p>
                <p>Billing Address:{" "}
                  {editingPayment ? (
                    <input
                      type="text"
                      value={user.billingAddress || ""}
                      onChange={(e) => setUser({ ...user, billingAddress: e.target.value })}
                      placeholder="N/A"
                    />
                  ) : (user.billingAddress || "N/A")}
                </p>
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <div>
              <h3>Booking History</h3>
              <div>
                <BookingHistoryTable />
              </div>
            </div>
          )}
        </div>
        {/* right container - buttons */}
        <div className="container-right">
          {activeTab === "dashboard" && (
            <button className="btn btn-signout two-hundred-width uppercase" onClick={handleSignOut}>
              SIGN OUT
            </button>
          )}

          {activeTab === "about" && (
            <>
              <button
                className="btn btn-primary two-hundred-width uppercase"
                onClick={() => {
                  if (editingAbout) {
                    handleSaveAbout();
                  } else {
                    setEditingAbout(true);
                  }
                }}
              >
                {editingAbout ? "SAVE" : "EDIT"}
              </button>
              {editingAbout && (
                <button className="btn btn-cancel two-hundred-width uppercase" onClick={() => setEditingAbout(false)}>
                  CANCEL
                </button>
              )}
              <button className="btn btn-back two-hundred-width uppercase" onClick={() => setActiveTab("dashboard")}>
                BACK
              </button>
            </>
          )}

          {activeTab === "car" && (
            <>
              <button
                className="btn btn-primary two-hundred-width uppercase"
                onClick={() => {
                  if (editingCar) {
                    handleSaveCar();
                  } else {
                    setEditingCar(true);
                  }
                }}
              >
                {editingCar ? "save" : "edit"}
              </button>
              <button className="btn btn-back two-hundred-width uppercase" onClick={() => setActiveTab("dashboard")}>
                BACK
              </button>
            </>
          )}

          {activeTab === "payment" && (
            <>
              <button
                className="btn btn-primary two-hundred-width uppercase"
                onClick={() => {
                  if (editingPayment) {
                    handleSavePayment();
                  } else {
                    setEditingPayment(true);
                  }
                }}
              >
                {editingPayment ? "SAVE" : "EDIT"}
              </button>
              <button className="btn btn-back two-hundred-width uppercase" onClick={() => setActiveTab("dashboard")}>
                BACK
              </button>
            </>
          )}

          {activeTab === "history" && (
            <button className="btn btn-back two-hundred-width uppercase" onClick={() => setActiveTab("dashboard")}>
              BACK
            </button>
          )}
        </div> 
      </div>
      <ChatBubble />
    </div>
  );
}

export default Profile;