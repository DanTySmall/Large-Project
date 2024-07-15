import React, {useState, useEffect} from 'react';
import LiquorNutritionFacts from './LiquorNutritionFacts.js';
import Ratings from './Ratings.js';
import '../css/LiquorPage.css';

const DisplayLiquor = ({liquor}) => {
    const [showRatings, setShowRatings] = useState(false);

    useEffect(() => {
        setShowRatings(false);
    }, [liquor]);

    const switchComp = () => {
        setShowRatings(!showRatings);
    };

    // Determine which component to display based on showRatings state
    const compToDisplay = showRatings ? (
        <Ratings switchComp={switchComp} liquorToDisplay = {liquor} />
    ) : (
        <LiquorNutritionFacts switchComp={switchComp} liquorToDisplay = {liquor}/>
    );

    return(
        <div className = "display-liq">
            {compToDisplay}
        </div>
    );
}

export default DisplayLiquor;