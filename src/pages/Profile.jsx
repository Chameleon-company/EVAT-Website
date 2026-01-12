// NOTE: For security reasons, card payment details are NOT stored in the backend.

// This section only saves card information locally in the browser.
// Full backend integration can be implemented
// in the future when actual payments need to be made.

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, House, KeyRound, CalendarDays, User, CreditCard, Phone, CircleUserRound, Car, CreditCard, BookText, LogOut, Pencil, Check, X, ArrowLeft } from 'lucide-react';
import NavBar from '../components/NavBar';
import profileImage from '../assets/profileImage.png';
import ChatBubble from "../components/ChatBubble";
import BookingHistoryTable from "../components/BookingHistoryTable";

import '../styles/Root.css';
import '../styles/Buttons.css';
import '../styles/Elements.css';
import '../styles/Fonts.css';
import '../styles/Forms.css';
import '../styles/NavBar.css';
import '../styles/Sidebar.css';
import '../styles/Tables.css';
import '../styles/Validation.css';

const API_URL = import.meta.env.VITE_API_URL;

function Profile() {
  const navigate = useNavigate();
  const location = useLocation();

  // Local state management
  const [errors, setErrors] = useState({});
  const [user, setUser] = useState(null);
  const [originalUser, setOriginalUser] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [editingCar, setEditingCar] = useState(false);
  const [editingPayment, setEditingPayment] = useState(false);
  const [editingAbout, setEditingAbout] = useState(false);
  const [history, setHistory] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  // New state for car dropdowns
  const [allVehicles, setAllVehicles] = useState([]);
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [years, setYears] = useState([]);
  // Payment information
  const [paymentErrors, setPaymentErrors] = useState({});
  const [paymentSuccessMessage, setPaymentSuccessMessage] = useState("");
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);

  // Reset tab to "dashboard" if user navigates back with reset flag
  useEffect(() => {
    if (location.pathname === "/profile") {
      if (location.state?.resetDashboard) {
        setActiveTab("dashboard");
        navigate(location.pathname, { replace: true });
      }
    }
  }, [location, navigate]);

  const storedUser = JSON.parse(localStorage.getItem("currentUser"));
  const token = storedUser?.token;

  // Fetch user profile on load
  useEffect(() => {
    if (!token) {
      navigate("/signin");
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
        if (!profileRes.ok)
          throw new Error("Failed to fetch user profile details");
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
        navigate("/signin");
      }
    };

    fetchUserProfile();
  }, [navigate, token]);

  useEffect(() => {
    if (editingCar) {
      fetch(`${API_URL}/vehicle`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          const items = (data.data || []).map((v) => ({
            ...v,
            id: v.id || v._id,
            year: v.year || v.model_release_year,
          }));
          setAllVehicles(items);
          setMakes(["Select", ...new Set(items.map((v) => v.make))]);
        })
        .catch((err) => console.error("Failed to load vehicles:", err));
    }
  }, [editingCar, user?.token]);

  // Fetch all vehicles when editing starts (to populate dropdown list)
  useEffect(() => {
    if (user?.car?.make) {
      const filteredModels = allVehicles
        .filter((v) => v.make === user.car.make)
        .map((v) => v.model);
      setModels(["Select", ...new Set(filteredModels)]);

      if (user?.car?.model) {
        const filteredYears = allVehicles
          .filter((v) => v.make === user.car.make && v.model === user.car.model)
          .map((v) => v.year)
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
    localStorage.removeItem("currentUser");
    navigate("/signin");
  };

  // To make sure mobile follows Au format
  const isValidMobile = (mobile) => {
    // Starts with 04 and has 10 digits total
    const regex = /^04\d{8}$/;
    return regex.test(mobile);
  };
  const validateAboutForm = () => {
    const newErrors = {};

    if (!user.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!user.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!user.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(user.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!user.mobile.trim()) {
      newErrors.mobile = "Phone number is required";
    } else if (!isValidMobile(user.mobile)) {
      newErrors.mobile = "Phone must start with 04 and be 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePaymentForm = () => {
    const errors = {};

    const cardNum = (user.cardNumber || "").replace(/\s+/g, "");
    if (!cardNum) {
      errors.cardNumber = "Card number is required";
    } else if (!/^\d{16}$/.test(cardNum)) {
      errors.cardNumber = "Card number must be 16 digits";
    }

    if (!user.expiryDate) {
      errors.expiryDate = "Expiry date is required";
    } else if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(user.expiryDate)) {
      errors.expiryDate = "Expiry must be in MM/YY format";
    } else {
      const [mm, yy] = user.expiryDate.split("/").map(Number);
      const now = new Date();
      const currentYear = now.getFullYear() % 100;
      const currentMonth = now.getMonth() + 1;

      if (yy < currentYear || (yy === currentYear && mm < currentMonth)) {
        errors.expiryDate = "Card has expired";
      }
    }

    if (!user.cvv) {
      errors.cvv = "CVV is required";
    } else if (!/^\d{3}$/.test(user.cvv)) {
      errors.cvv = "CVV must be 3 digits";
    }

    if (!user.billingAddress) {
      errors.billingAddress = "Billing address is required";
    }

    setPaymentErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveAbout = async () => {
    if (!validateAboutForm()) return;

    try {
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


      if (!response.ok) {
        toast.error(
          <div>
            Failed to update profile info
          </div>,
          { position: "top-center", autoClose: 2000, closeOnClick: true, draggable: true, closeButton: true, toastId: "profile-update-error" }
        );
        throw new Error("Failed to update profile info");
      }

      setEditingAbout(false);
      toast.success(
        <div>
          Profile information updated successfully!
        </div>,
        { position: "top-center", autoClose: 2000, closeOnClick: true, draggable: true, closeButton: true, toastId: "profile-update-success" }
      );
      setIsSuccess(true);
      setErrors({});

    } catch (err) {
      setSuccessMessage("");
      setIsSuccess(false);
      console.error(err);
      toast.error(
        <div>
          Failed to update profile: {err.message}
        </div>,
        { position: "top-center", autoClose: 2000, closeOnClick: true, draggable: true, closeButton: true, toastId: "profile-update-error" }
      );
    }
  };

  const handleSaveCar = async () => {
    try {
      const token = user?.token;

      let newErrors = {};

      if (user.car.make == "Select") {
        newErrors.carMake = "Please select a make";
      }

      if (user.car.model == "Select" || user.car.model === "") {
        newErrors.carModel = "Please select a model";
      }
      if (user.car.year == "Select" || user.car.year === "") {
        newErrors.carYear = "Please select a year";
      }
      setErrors(newErrors);

      // The car selected must exist in allVehicles (fro /api/vehicle)
      const selectedVehicle = allVehicles.find(
        (v) =>
          v.make === user.car?.make &&
          v.model === user.car?.model &&
          String(v.model_release_year || v.year) === String(user.car?.year)
      );

      if (!selectedVehicle) {
        toast.error(
          <div>
            Invalid vehicle selection
          </div>,
          { position: "top-center", autoClose: 2000, closeOnClick: true, draggable: true, closeButton: true, toastId: "vehicle-invalid-error" }
        );
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
        year:
          selectedVehicle.year ?? selectedVehicle.model_release_year ?? null,
      };

      setUser((prev) => {
        const next = { ...prev, car: normalizedCar };
        localStorage.setItem("currentUser", JSON.stringify(next));
        return next;
      });

      setEditingCar(false);
      toast.success(
        <div>
          Vehicle updated successfully!
        </div>,
        { position: "top-center", autoClose: 2000, closeOnClick: true, draggable: true, closeButton: true, toastId: "vehicle-update-success" }
      );
    } catch (err) {
      console.error(err);
      toast.error(
        <div>
          Failed to update vehicle: {err.message}
        </div>,
        { position: "top-center", autoClose: 2000, closeOnClick: true, draggable: true, closeButton: true, toastId: "vehicle-update-error" }
      );
    }
  };

  const handleSavePayment = () => {
    if (!validatePaymentForm()) return;

    const cardNum = (user.cardNumber || "").replace(/\s+/g, "");

    setUser(prev => {
      const next = { ...prev, cardNumber: cardNum };
      localStorage.setItem("currentUser", JSON.stringify(next));
      return next;
    });

    setEditingPayment(false);
    setPaymentErrors({});
    setPaymentSuccessMessage("Payment information updated successfully!");
    setIsPaymentSuccess(true);

    // ✅ Auto-hide after 3 seconds
    setTimeout(() => {
      setPaymentSuccessMessage("");
      setIsPaymentSuccess(false);
    }, 3000);
  };

  if (!user) return null;

  return (
    <div>
      <NavBar />
      {/* background */}
      <div className="background-image" />
      {/* title */}
      <h1 className='h1 text-center auto-width'>My Dashboard</h1>
      <div className="container horizontal auto-width">
        {/* left container - profile image*/}
        <div className="inner-left">
          <div className="profile-image">
            {user.firstName?.charAt(0) || '?'}
            <img src={profileImage} alt="Profile" />
          </div>
        </div>
        
        {/* center container - options and details*/}
        <div className="inner-center">
          {activeTab === "dashboard" && (
            <>
              <button className="btn btn-primary two-hundred-width" onClick={() => setActiveTab("about")}> <CircleUserRound /> About Me</button>
              <button className="btn btn-primary two-hundred-width" onClick={() => setActiveTab("car")}> <Car /> My Car</button>
              <button className="btn btn-primary two-hundred-width" onClick={() => setActiveTab("payment")}> <CreditCard /> Payment</button>
              <button className="btn btn-primary two-hundred-width" onClick={() => setActiveTab("history")}> <BookText /> Booking History</button>
            </>
          )}

          {/* About Me */}
          {activeTab === "about" && (
            <div>
              <h3>About Me</h3>
              <div className="input-and-label-same-line ">
                <label className='form-label required'>First Name: </label>
                {editingAbout ? (
                  <div className='icon-inside-input two-hundred-width'>
                    <User className="input-icon" />
                    <input
                      className="input"
                      // className={isSuccess ? "input-success" : ""}
                      type="text"
                      value={user.firstName || ""}
                      onChange={(e) => {
                        setUser({ ...user, firstName: e.target.value });
                        setErrors({ ...errors, firstName: "" });
                      }}
                    />
                  </div>
                ) : (
                  user.firstName
                )}
                {errors.firstName && (
                  // Come back here
                  <small className="error-text">{errors.firstName}</small>
                )}
              </div>

              <div className="input-and-label-same-line">
                <label className='form-label required'>Last Name: </label>
                {editingAbout ? (
                  <div className='icon-inside-input two-hundred-width'>
                    <User className="input-icon" />
                    <input
                      className="input"
                      // className={isSuccess ? "input-success" : ""}
                      type="text"
                      value={user.lastName || ""}
                      placeholder="Enter your last name"
                      onChange={(e) => {
                        setUser({ ...user, lastName: e.target.value });
                        setErrors({ ...errors, lastName: "" });
                      }}
                    />
                  </div>
                ) : (
                  user.lastName
                )}
                {errors.lastName && (
                  // Come back here
                  <small className="error-text">{errors.lastName}</small>
                )}
              </div>

              <div className="input-and-label-same-line">
                <label className='form-label'>Email:</label>
                <span className='form-label text-right'>{user.email || "N/A"}</span>
              </div>

              <div className="input-and-label-same-line">
                <label className='form-label required'>Phone: </label>
                {editingAbout ? (
                  <div className='icon-inside-input two-hundred-width'>
                    <Phone className="input-icon" />
                    <input
                      className="input"
                      // className={isSuccess ? "input-success" : ""}
                      type="text"
                      value={user.mobile || ""}
                      placeholder="Enter your phone"
                      onChange={(e) => {
                        setUser({ ...user, mobile: e.target.value });
                        setErrors({ ...errors, mobile: "" });
                      }}
                    />
                  </div>
                ) : (
                  user.mobile || "N/A"
                )}
                {errors.mobile && (
                  <small className="error-text">{errors.mobile}</small>
                )}
              </div>
            </div>
          )}

          {/* My Car */}
          {activeTab === "car" && (
            <div>
              <h3>My Car</h3>
              <div className="input-and-label-same-line">
                <label className='form-label required'>Car Make: </label>
                {editingCar ? (
                  <select
                    className="input two-hundred-width"
                    value={user.car?.make || "Select"}
                    onChange={(e) => {
                      setUser({ ...user, car: { ...user.car, make: e.target.value, model: "", year: "" } });
                    }}
                  >
                    {makes.map((make, idx) => (
                      <option key={idx} value={make}>
                        {make}
                      </option>
                    ))}
                  </select>
                ) : (
                  user.car?.make || "N/A"
                )}
                {errors.carMake && (
                  // Come back here
                  <small className="error-text">{errors.carMake}</small>
                )}
              </div>

              <div className="input-and-label-same-line">
                <label className='form-label required'>Car Model: </label>
                {editingCar ? (
                  <select
                    className="input two-hundred-width"
                    value={user.car?.model || "Select"}
                    onChange={(e) => {
                      setUser({...user, car: { ...user.car, model: e.target.value, year: "" }});
                      setErrors({ ...errors, carMake: "" });
                    }}
                  >
                    {models.map((model, idx) => (
                      <option key={idx} value={model}>
                        {model}
                      </option>
                    ))}
                  </select>
                ) : (
                  user.car?.model || "N/A"
                )}
                {errors.carModel && (
                  // Come back here
                  <small className="error-text">{errors.carModel}</small>
                )}
              </div>

              <div className="input-and-label-same-line">
                <label className='form-label required'>Model Year: </label>
                {editingCar ? (
                  <select
                    className="input two-hundred-width"
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
                ) : (
                  user.car?.year || "N/A"
                )}
                {errors.carYear && (
                  // Come back here
                  <small className="error-text">{errors.carYear}</small>
                )}
              </div>
            </div>
          )}

          {/* Payment */}
          {activeTab === "payment" && (
            <div>
              <h3>Payment Information</h3>
              {/* CARD NUMBER */}
              <div className="input-and-label-same-line">
                <label className='form-label required'>Card: </label>
                {editingPayment ? (
                  <div className='icon-inside-input'>
                    <CreditCard className="input-icon" />
                    <input
                      className="input two-hundred-width"
                      // className={isPaymentSuccess ? "input-success" : ""}
                      type="text"
                      value={user.cardNumber || ""}
                      placeholder="1234 5678 9012 3456"
                      onChange={(e) => {
                        // Only digits, max 16
                        let val = e.target.value.replace(/\D/g, '').slice(0, 16);
                        // Add spaces every 4 digits for display
                        val = val.replace(/(\d{4})(?=\d)/g, '$1 ');
                        setUser({ ...user, cardNumber: val });
                        setPaymentErrors({ ...paymentErrors, cardNumber: "" });
                      }}
                    />
                  </div>
                ) : (
                  user.cardNumber
                    ? "**** **** **** " + user.cardNumber.replace(/\s/g, '').slice(-4)
                    : "**** **** **** 1234"
                )}
                {paymentErrors.cardNumber && (
                  // Come back here
                  <small className="error-text">{paymentErrors.cardNumber}</small>
                )}
              </div>

              {/* EXPIRY DATE */}
              <div className="input-and-label-same-line">
                <label className='form-label required'>Expiry Date: </label>
                {editingPayment ? (
                  <div className='icon-inside-input'>
                    <CalendarDays className="input-icon" />
                    <input
                      className="input two-hundred-width"
                      // className={isPaymentSuccess ? "input-success" : ""}
                      type="text"
                      value={user.expiryDate || ""}
                      placeholder="MM/YY"
                      onChange={(e) => {
                        let val = e.target.value.replace(/\D/g, '').slice(0, 4); // digits only, max 4
                        if (val.length > 2) val = val.slice(0, 2) + '/' + val.slice(2); // insert '/'
                        setUser({ ...user, expiryDate: val });
                        setPaymentErrors({ ...paymentErrors, expiryDate: "" });
                      }}
                    />
                  </div>
                ) : (
                  user.expiryDate || "MM/YY"
                )}
                {paymentErrors.expiryDate && (
                  // Come back here
                  <small className="error-text">{paymentErrors.expiryDate}</small>
                )}
              </div>

              {/* CVV */}
              <div className="input-and-label-same-line">
                <label className='form-label required'>CVV: </label>
                {editingPayment ? (
                  <div className='icon-inside-input'>
                    <KeyRound className="input-icon" />
                    <input
                      className="input two-hundred-width"
                      // className={isPaymentSuccess ? "input-success" : ""}
                      type="text"
                      value={user.cvv || ""}
                      placeholder="123"
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 3);
                        setUser({ ...user, cvv: val });
                        setPaymentErrors({ ...paymentErrors, cvv: "" });
                      }}
                    />
                  </div>
                ) : (
                  "***"
                )}
                {paymentErrors.cvv && (
                  // Come back here
                  <small className="error-text">{paymentErrors.cvv}</small>
                )}
              </div>

              {/* BILLING ADDRESS */}
              <div className="input-and-label-same-line">
                <label className='form-label required'>Billing Address: </label>
                {editingPayment ? (
                  <div className='icon-inside-input'>
                    <House className="input-icon" />
                    <input
                      className="input two-hundred-width"
                      type="text"
                      value={user.billingAddress || ""}
                        placeholder="Enter your billing address"
                      onChange={(e) => {
                        setUser({ ...user, billingAddress: e.target.value });
                        setPaymentErrors({ ...paymentErrors, billingAddress: "" });
                      }}
                    />
                  </div>
                ) : (
                  user.billingAddress || "N/A"
                )}
                {paymentErrors.billingAddress && (
                  // Come back here
                  <small className="error-text">{paymentErrors.billingAddress}</small>
                )}
                {paymentSuccessMessage && (
                  <div className="success-text fade-in">
                    {paymentSuccessMessage}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* History */}
          {activeTab === "history" && (
            <div>
              <h3>Booking History</h3>
              <div>
                <BookingHistoryTable />
              </div>
            </div>
          )}
        </div>

        {/* RIGHT SECTION */}
        <div className="inner-right">
          {activeTab === "dashboard" && (
            <button 
              className="btn btn-secondary two-hundred-width uppercase" 
              onClick={handleSignOut}
            >
              SIGN OUT
            </button>
          )}

          {/* About Me */}
          {activeTab === "about" && (
            <>
              {/* Save/Edit button */}
              <button
                className="btn btn-primary two-hundred-width uppercase"
                onClick={() => {
                  if (editingAbout) {
                    handleSaveAbout();
                  } else {
                    setOriginalUser(user); // Save the current values before editing
                    setEditingAbout(true);
                  }
                }}
              >
                {editingAbout ? <Check /> : <Pencil /> }
                {editingAbout ? "SAVE" : "EDIT"}
              </button>

              {/* Cancel button */}
              {editingAbout && (
                <button 
                  className="btn btn-transparent two-hundred-width uppercase" 
                  onClick={() => {
                    setUser(originalUser);
                    setEditingAbout(false);
                    setErrors({});
                    // toast.info(
                    //   <div>
                    //     Changes discarded
                    //   </div>,
                    //   { position: "top-center", autoClose: 2000, closeOnClick: true, draggable: true, closeButton: true, toastId: "user-discard-info" }
                    // );
                  }}
                >
                  <X /> CANCEL
                </button>
              )}

              {/* Back button */}
              {!editingAbout && (
                <button 
                  className="btn btn-tertiary two-hundred-width uppercase" 
                  onClick={() => setActiveTab("dashboard")}
                >
                  <ArrowLeft /> BACK
                </button>
              )}
            </>
          )}

          {/* My Car */}
          {activeTab === "car" && (
            <>
              {/* Save/Edit button */}
              <button
                className="btn btn-primary two-hundred-width uppercase"
                onClick={() => {
                  if (editingCar) {
                    handleSaveCar();
                  } else {
                    setOriginalUser(user); // Save the current values before editing
                    setEditingCar(true);
                  }
                }}
              >
                {editingCar ? <Check /> : <Pencil /> }
                {editingCar ? "SAVE" : "EDIT"}
              </button>
              
              {/* Cancel button */}
              {editingCar && (
                <button 
                  className="btn btn-transparent two-hundred-width uppercase" 
                  onClick={() => {
                    setUser(originalUser);
                    setEditingCar(false);
                    setErrors({});
                    // toast.info(
                    //   <div>
                    //     Changes discarded
                    //   </div>,
                    //   { position: "top-center", autoClose: 2000, closeOnClick: true, draggable: true, closeButton: true, toastId: "vehicle-discard-info" }
                    // );
                  }}
                >
                  <X /> CANCEL
                </button>
              )}

              {/* Back button */}
              {!editingCar && (
                <button 
                  className="btn btn-tertiary two-hundred-width uppercase" 
                  onClick={() => setActiveTab("dashboard")}
                >
                  <ArrowLeft /> BACK
                </button>
              )}
            </>
          )}

          {/* Payment  */}
          {activeTab === "payment" && (
            <>
              {/* Save/Edit button */}
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
                {editingPayment ? <Check /> : <Pencil /> }
                {editingPayment ? "SAVE" : "EDIT"}
              </button>
              
              {/* Cancel button */}
              {editingPayment && (
                <button 
                  className="btn btn-transparent two-hundred-width uppercase" 
                  onClick={() => setEditingPayment(false)}
                >
                  <X /> CANCEL
                </button>
              )}

              {/* Back button */}
              {!editingPayment && (
                <button 
                  className="btn btn-tertiary two-hundred-width uppercase" 
                  onClick={() => setActiveTab("dashboard")}
                >
                  <ArrowLeft /> BACK
                </button>
              )}
            </>
          )}

          {/* Booking History */}
          {activeTab === "history" && (
            // Back button
            <button 
              className="btn btn-tertiary two-hundred-width uppercase" 
              onClick={() => setActiveTab("dashboard")}
            >
                <ArrowLeft /> BACK
            </button>
          )}
        </div> 
      </div>
      <ChatBubble />
    </div >
  );
}

export default Profile;
