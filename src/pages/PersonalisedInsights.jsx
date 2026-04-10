import React, { useEffect } from "react";
import NavBar from "../components/NavBar";
import BarChart from "../components/BarChart";
//import { UserContext } from '../context/user';
import { getMyInsights } from "../services/personalisedEvInsightsService";

import "../styles/Root.css";
import "../styles/Fonts.css";
import "../styles/NavBar.css";



export default function PersonalisedInsights() {
    //const { user } = useContext(UserContext);
    const tokenFull = localStorage.getItem("currentUser");
    const token = tokenFull ? JSON.parse(tokenFull).token : null;

    useEffect(() => {
        loadInsightData();
    });

    const Data = {
        labels: ['You', 'Compared to Similar Drivers', 'Compared to All Drivers'],
        datasets: [
        {
            label: 'Monthly Sales',
            data: [51.96, 27.57, 58.25],
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
        },
        ],
    };


    const loadInsightData = async () => {
        //setIsLoading(true);
        try {
            const response = await getMyInsights(token);
            console.log(response);
        } catch (error) {
            console.error('Error insight data:', error);
        } 
    }

    return (
        <div>
            <NavBar />
            <div style={{ maxWidth: "50%" }}>
                <h2 style={{ textAlign: "center" }}>Bar Chart</h2>
                <BarChart data={Data} title={"Average Fuel Efficiency of Vehicle (L/100km)"} />
            </div>
        </div>
    );
}