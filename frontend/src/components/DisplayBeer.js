import React, {useState, useEffect} from 'react';
import NutritionFacts from './NutritionFacts.js';
import Ratings from './Ratings.js';

const DisplayBeer = ({beer}) => {
    const [showRatings, setShowRatings] = useState(false);

    useEffect(() => {
        setShowRatings(false);
    }, [beer]);

    const switchComp = () => {
        setShowRatings(!showRatings);
    };

    // Determine which component to display based on showRatings state
    const compToDisplay = showRatings ? (
        <Ratings switchComp={switchComp} beerToDisplay = {beer} />
    ) : (
        <NutritionFacts switchComp={switchComp} beerToDisplay = {beer}/>
    );

    return(
        <div class = "display-beer">
            {compToDisplay}
        </div>
    );
}

export default DisplayBeer;