import WineHeader from "../components/WineHeader";
import React, {useState, useEffect} from 'react';
import WineList from "../components/WineList";
import '../css/WinePage.css';
import '../main.css';
import Footer from '../components/WineFooter.js';
import WineOfTheWeek from '../components/WineOfTheWeek.js';

function WinePage(){

    const [showWineOfTheMonth, setShowWineOfTheMonth] = useState(true);

    const switchComponents = () => {
        setShowWineOfTheMonth(prevState => !prevState);
    };

    // Determine which component to display based on showBeerOfTheDay state
    const componentToDisplay = showWineOfTheMonth ? (
        <WineOfTheWeek switchComponents={switchComponents} />
    ) : (
        <WineList switchComponents={switchComponents} />
    );

    return(
        <div className = "page">
            <div className ="wine-page">
                <div className = "wine-content">
                    <WineHeader />
                    {componentToDisplay}
                </div>
            </div>
            
            <Footer />
        </div>
    );
}

export default WinePage;