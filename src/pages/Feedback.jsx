import React from 'react';
import FeedbackForm from '../components/FeedbackForm';
import NavBar from '../components/NavBar';

import '../styles/Buttons.css';
import '../styles/Elements.css';
import '../styles/Fonts.css';
import '../styles/Forms.css';
import '../styles/NavBar.css';
import '../styles/Sidebar.css';
import '../styles/Tables.css';
import '../styles/Validation.css';

function Feedback() {
  return (
    <div>
      <NavBar />
      {/* background */}
      <div className="background-image" />
      <FeedbackForm />
    </div>
  );
}

export default Feedback;
