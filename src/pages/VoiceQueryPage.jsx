import VoiceQuery from '../components/VoiceQuery';
import NavBar from '../components/NavBar';
import '../styles/VoiceQuery.css';

function VoiceQueryPage() {
  return (
    <div className="page-container">
      <NavBar />
      <div className="page-content">
        <VoiceQuery />
      </div>
    </div>
  );
}

export default VoiceQueryPage;
