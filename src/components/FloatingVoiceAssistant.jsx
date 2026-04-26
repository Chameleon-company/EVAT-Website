import { useState } from 'react';
import { Mic, X } from 'lucide-react';
import VoiceQuery from './VoiceQuery';
import '../styles/FloatingVoiceAssistant.css';

function FloatingVoiceAssistant({ onQueryResult }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleAssistant = () => {
        setIsOpen((prev) => !prev);
    };

    return (
        <div className="floating-voice-wrapper">
            {isOpen && (
                <div className="floating-voice-panel">
                    <div className="floating-voice-header">
                        <div>
                            <h3>EV Charging Assistant</h3>
                            <div className="floating-voice-subtitle">
                                Ask by text or voice
                            </div>
                        </div>

                        <button
                            className="floating-voice-close"
                            onClick={toggleAssistant}
                            aria-label="Close voice assistant"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <div className="floating-voice-body">
                        <VoiceQuery onQueryResult={onQueryResult} />
                    </div>
                </div>
            )}

            <button
                className="floating-voice-button"
                onClick={toggleAssistant}
                aria-label="Open voice assistant"
                title="Open Voice Assistant"
            >
                <Mic size={26} />
            </button>
        </div>
    );
}

export default FloatingVoiceAssistant;