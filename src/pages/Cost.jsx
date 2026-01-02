import React from "react";
import NavBar from "../components/NavBar";
import CostCalculation from "../components/CostCalculation";

import "../styles/Cost.css";
import '../styles/Buttons.css';
import '../styles/Elements.css';
import '../styles/Fonts.css';
import '../styles/Forms.css';
import '../styles/NavBar.css';
import '../styles/Sidebar.css';
import '../styles/Tables.css';
import '../styles/Validation.css';

export default function Cost() {
  return (
    <div className="auth-container">
      <NavBar />
      <div className="cost-calc-glass">
        <CostCalculation />
      </div>
    </div>
  );
}

