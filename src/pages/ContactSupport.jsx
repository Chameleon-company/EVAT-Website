import NavBar from "../components/NavBar";
import ChatBubble from "../components/ChatBubble";
import SupportRequestForm from "../components/SupportRequestForm";

import '../styles/Buttons.css';
import '../styles/Elements.css';
import '../styles/Fonts.css';
import '../styles/Forms.css';
import '../styles/NavBar.css';
import '../styles/Sidebar.css';
import '../styles/Tables.css';
import '../styles/Validation.css';

export default function ContactSupport() {
  return (
    <div>
      <NavBar />
      {/* background */}
      <div className="background-image" />
      {/* title */}
      {/* <h1 className='h1 text-center auto-width'>Contact Support</h1> */}
      <div className="container-hidden center">
        {/* cards */}
        <div className="center">
          <div className="card-grid">
            <div className="card center">
              <h5>Call Us</h5>
              <p>1-800-XXX-XXXX</p>
              <p>Mon–Fri, 9AM – 6PM (EST)</p>
            </div>

            <div className="card center">
              <h5>Email Us</h5>
              <p>support@domain.com</p>
              <p>tech@domain.com</p>
            </div>

            <div className="card center">
              <h5>Mailing Address</h5>
              <p>123 Green Drive</p>
              <p>Clean City, ST 00000</p>
            </div>
          </div>
          {/* form */}
          <SupportRequestForm />
        </div>
      </div>
      <ChatBubble />
    </div>
  );
}