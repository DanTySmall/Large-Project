import WineHeader from "../components/WineHeader";
import React, { } from 'react';
import WineList from "../components/WineList";
import '../css/WinePage.css';
import '../main.css';
import Footer from '../components/WineFooter.js';

function WinePage(){
    return(
        <div className = "page">
            <div className ="wine-page">
                <div className = "wine-content">
                    <WineHeader />
                    <WineList />
                </div>
            </div>
            
            <Footer />
        </div>
    );
}

export default WinePage;