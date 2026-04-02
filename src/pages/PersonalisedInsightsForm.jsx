import React from "react";
import NavBar from "../components/NavBar";
import PersonalisedInsightsFormComponent from "../components/PersonalisedInsightsFormComponent";

import "../styles/Root.css";
import "../styles/Buttons.css";
import "../styles/Elements.css";
import "../styles/Fonts.css";
import "../styles/Forms.css";
import "../styles/NavBar.css";
import "../styles/Sidebar.css";
import "../styles/Tables.css";
import "../styles/Validation.css";

export default function PersonalisedInsightsForm() {
  return (
    <div>
      <NavBar />
      <div className="background-image" />
      <PersonalisedInsightsFormComponent />
    </div>
  );
}
