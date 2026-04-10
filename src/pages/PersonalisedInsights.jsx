import React, { useEffect } from "react";
import NavBar from "../components/NavBar";
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
    })

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
            
        </div>
    );
}