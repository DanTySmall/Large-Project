import WineHeader from "../components/WineHeader";
import React, { } from 'react';
import WineList from "../components/WineList";
import '../css/WinePage.css';
import '../main.css';

function WinePage(){
    return(
        <div className ="wine-page">
            <div className = "wine-content">
                <WineHeader />
                <WineList />
            </div>
        </div>
    );
}

export default WinePage;