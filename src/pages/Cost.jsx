import React from "react";
import NavBar from "../components/NavBar";
import CostCalculation from "../components/CostCalculation";

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
    <div>
      <NavBar />
      {/* background */}
      <div className="background-image" />
      <CostCalculation />
    </div>
  );
}

