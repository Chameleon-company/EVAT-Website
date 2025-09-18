import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Background from "../components/Background";
import profileImage from '../assets/game-car.png';
import '../styles/Profile.css';
import '../styles/Game.css';

// import ChatBubble from "../components/ChatBubble"; // Uncomment when ready

function Game() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("currentUser")));
  const [gameProfile, setGameProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user || !user.token) {
      navigate("/signin");
      return;
    }

    fetchProfile();
  }, [user, navigate]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8080/api/gamification/profile", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setGameProfile(data.data);
        setMessage("");
      } else {
        setMessage(data.message || "Failed to load profile.");
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
      setMessage("Could not load game profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleAppLogin = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/gamification/action", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          action_type: "app_login",
          session_id: `web-session-${Date.now()}`,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        setMessage("App login successful! +10 points earned.");
        await fetchProfile();
      } else {
        setMessage(result.message || "App login failed.");
      }
    } catch (err) {
      console.error("App login error:", err);
      setMessage("App login failed.");
    }
  };

  const [pointChange, setPointChange] = useState(null);

  const triggerGamificationAction = async (actionType) => {
  if (!user?.token || !gameProfile?.gamification_profile) return;

  const previousPoints = gameProfile.gamification_profile.points_balance;

  try {
    const res = await fetch("http://localhost:8080/api/gamification/action", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        action_type: actionType,
        session_id: `web-session-${Date.now()}-${actionType}`,
      }),
    });

    const result = await res.json();

    if (res.ok) {
      await fetchProfile();  // Refresh gameProfile
      const updatedPoints = result?.data?.new_balance ?? previousPoints;
      setPointChange(updatedPoints - previousPoints);
      setTimeout(() => setPointChange(null), 1500); // Auto-hide
    } else {
      console.error(`Action failed: ${result.message}`);
    }
  } catch (err) {
    console.error("Gamification action error:", err);
  }
};



  const handleSignOut = () => {
    localStorage.removeItem("currentUser");
    navigate("/signin");
  };

  return (
    <div className="dashboard-page fade-in">
      <NavBar />
      <Background>
        <div className="dashboard-left">
          <h2 className="dashboard-title">Character</h2>
          <div className="dashboard-profile-image">
            <img
              src={profileImage}
              alt="Profile"
              style={{ width: '350px', height: '280px', objectFit: 'cover' }}
            />
          </div>
        </div>

        <div className="dashboard-center">
          <button className="dashboard-btn" onClick={handleAppLogin}>
            App Login Check-In
          </button>

          <div className="action-buttons">
            <p><strong>Try Action-Based Rewards:</strong></p>
            <button onClick={() => triggerGamificationAction("check_in")}>Check-In</button>
            <button onClick={() => triggerGamificationAction("report_fault")}>Fault Report</button>
            <button onClick={() => triggerGamificationAction("validate_ai_prediction")}>AI Validation</button>
            <button onClick={() => triggerGamificationAction("discover_new_station_in_black_spot")}>Black Spot Discovery</button>
            <button onClick={() => triggerGamificationAction("use_route_planner")}>Route Plan</button>
            <button onClick={() => triggerGamificationAction("ask_chatbot_question")}>Chatbot Question</button>
          </div>

          {loading ? (
            <div className="loader">Loading game profile...</div>
          ) : gameProfile ? (
            <div className="game-info">
              <p><strong>Points:</strong> {gameProfile.gamification_profile?.points_balance}</p>
              <p><strong>Streak:</strong> {gameProfile.engagement_metrics?.current_app_login_streak} day(s)</p>
              <p><strong>Longest Streak:</strong> {gameProfile.engagement_metrics?.longest_app_login_streak} day(s)</p>
              <p><strong>Last Login:</strong> {new Date(gameProfile.engagement_metrics?.last_login_date).toLocaleDateString()}</p>
              {message && <p className="status-message">{message}</p>}
            </div>
          ) : (
            <p>No game profile data.</p>
          )}
        </div>
        {pointChange && <p className="point-feedback">+{pointChange} Points!</p>}
        <div className="dashboard-right">
          <button className="button" onClick={handleSignOut}>
            SIGN OUT
          </button>
        </div>
      </Background>
      {/* <ChatBubble /> */}
    </div>
  );
}

export default Game;
