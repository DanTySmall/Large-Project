import React, { useState, } from 'react';
import BeerHeader from '../components/BeerHeader.js';
import BeerOfTheDay from '../components/BeerOfTheDay.js';
import BeerList from '../components/BeerList.js';
import Footer from '../components/BeerFooter.js';

function BeerPage() {
    const [showBeerOfTheDay, setShowBeerOfTheDay] = useState(true);

    const switchComponents = () => {
        setShowBeerOfTheDay(prevState => !prevState);
    };

    // Determine which component to display based on showBeerOfTheDay state
    const componentToDisplay = showBeerOfTheDay ? (
        <BeerOfTheDay switchComponents={switchComponents} />
    ) : (
        <BeerList switchComponents={switchComponents} />
    );

    return (
        <div className = "page">
            <div className="beer-page">
                <div className="beer-content">
                    <BeerHeader />
                    {componentToDisplay}
                </div>
            </div>
            
            <Footer />
        </div>
    );
}

export default BeerPage;
