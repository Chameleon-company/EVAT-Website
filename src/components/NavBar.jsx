import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import profileImage from '../assets/profileImage.png';

function NavBar() {
    const navigate = useNavigate();
    const location = useLocation();

    // Highlight active button
    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar">
            <div className="left-navbar">
                <img src={logo} alt="Logo" className="logo-navbar" />
                <h5 className='title-navbar'>Electric Vehicle Adoption Tool</h5>
            </div>
            <div className="right-navbar">
                <div>
                    <button 
                        className={`btn btn-navbar ${isActive('/profile') ? 'active' : ''}`} 
                        onClick={() => navigate('/profile', { state: { resetDashboard: true } })}
                    >My Dashboard</button>
                    <button 
                        className={`btn btn-navbar ${isActive('/map') ? 'active' : ''}`} 
                        onClick={() => navigate('/map')}
                    >Map</button>
                    <button 
                        className={`btn btn-navbar ${isActive('/favourites') ? 'active' : ''}`} 
                        onClick={() => navigate('/favourites')}
                    >Favourites</button>
                    <button 
                        className={`btn btn-navbar ${isActive('/game') ? 'active' : ''}`} 
                        onClick={() => navigate('/game')}
                    >Rewards</button>
                    <button 
                        className={`btn btn-navbar ${isActive('/cost') ? 'active' : ''}`} 
                        onClick={() => navigate('/cost')}
                    >Vehicle Analysis</button>
                    <button 
                        className={`btn btn-navbar ${isActive('/feedback') ? 'active' : ''}`} 
                        onClick={() => navigate('/feedback')}
                    >Feedback</button>
                    <button 
                        className={`btn btn-navbar ${isActive('/support') ? 'active' : ''}`} 
                        onClick={() => navigate('/support')}
                    >Contact Support</button>
                </div>
                <img src={profileImage} alt="Profile" className="icon-navbar middle" />
            </div>
        </nav>
        
    );
}


export default NavBar;