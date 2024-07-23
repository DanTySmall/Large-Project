import LiquorHeader from "../components/LiquorHeader";
import React, { useState, useEffect } from 'react';
import LiquorList from "../components/LiquorList";
import LiquorOfTheMonth from '../components/LiquorOfTheMonth.js';
import '../css/LiquorPage.css';
import '../main.css';
import Footer from '../components/LiqFooter.js';

function LiquorPage(){

    const [showLiquorOfTheMonth, setShowLiquorOfTheMonth] = useState(true);

    const switchComponents = () => {
        setShowLiquorOfTheMonth(prevState => !prevState);
    };

    // Determine which component to display based on showBeerOfTheDay state
    const componentToDisplay = showLiquorOfTheMonth ? (
        <LiquorOfTheMonth switchComponents={switchComponents} />
    ) : (
        <LiquorList switchComponents={switchComponents} />
    );

    return(
        <div className = "page">
            <div className ="liq-page">
                <div className = "liq-content">
                    <LiquorHeader />
                    {componentToDisplay}
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default LiquorPage;