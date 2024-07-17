import React, {useState, useEffect} from 'react';
import WineNutritionFacts from './WineNutritionFacts.js';
import WineRatings from './WineRatings.js';
import '../css/WinePage.css';

const DisplayWine = ({wine}) => {
    const [showRatings, setShowRatings] = useState(false);

    useEffect(() => {
        setShowRatings(false);
    }, [wine]);

    const switchComp = () => {
        setShowRatings(!showRatings);
    };

    // Determine which component to display based on showRatings state
    const compToDisplay = showRatings ? (
        <WineRatings switchComp={switchComp} wineToDisplay = {wine} />
    ) : (
        <WineNutritionFacts switchComp={switchComp} wineToDisplay = {wine}/>
    );

    return(
        <div className = "display-wine">
            {compToDisplay}
        </div>
    );
}

export default DisplayWine;