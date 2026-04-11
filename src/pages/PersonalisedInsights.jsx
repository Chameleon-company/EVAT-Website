import React from "react";
import NavBar from "../components/NavBar";
import InsightsDisplay from "../components/InsightsDisplay";

import "../styles/NavBar.css";


export default function PersonalisedInsights() {
    return (
        <div>
            <NavBar />
            <InsightsDisplay />
        </div>
    );
}