import React, {useState, useEffect} from 'react';
import BeerNutritionFacts from './BeerNutritionFacts.js';
import BeerRatings from './BeerRatings.js';
import '../css/BeerPage.css'

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
        <BeerRatings switchComp={switchComp} beerToDisplay = {beer} />
    ) : (
        <BeerNutritionFacts switchComp={switchComp} beerToDisplay = {beer}/>
    );

    return(
        <div className = "display-beer">
            {compToDisplay}
        </div>
    );
}

export default DisplayBeer;