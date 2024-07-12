import React from 'react';
import FavButton from './FavButton.js';

const NutritionFacts = ({beerToDisplay, switchComp}) => {
    return(
        <div>
            <h1>{beerToDisplay.Name}</h1>
            <div className = "beer-info">
                <h1 className = "beer-info-header">Company: </h1> <p>{beerToDisplay.Company}</p>
                <h1 className = "beer-info-header">Style:</h1> <p>{beerToDisplay.Style}</p>
                <h1 className = "beer-info-header">ABV:</h1> <p>{beerToDisplay.ABV}%</p>
                <h1 className = "beer-info-header">Calories:</h1> <p>{beerToDisplay.Calories}</p>
                <h1 className = "beer-info-header">Origin:</h1> <p>{beerToDisplay.Origin}</p>
                <h1 className = "beer-info-header">Favorite?</h1><div className = "fav-button-conatiner-in-list">{<FavButton currentBeer={beerToDisplay} />}</div>
                <button onClick={switchComp} className = "ratings-button">Rate Beer<i className="bi bi-arrow-right"></i></button>
            </div>
        </div>
    );
}

export default NutritionFacts;