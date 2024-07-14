import React from 'react';
import FavButton from './FavButton.js';
import '../main.css';
import '../css/BeerPage.css';

const BeerNutritionFacts = ({beerToDisplay, switchComp}) => {
    return(
        <div>
            <h1>{beerToDisplay.Name}</h1>
            <div className = "beer-info">
                <div className="nutrition-item">
                    <h1 className="beer-info-header">Company: </h1> 
                    <p>{beerToDisplay.Company}</p>
                </div>
                <div className="nutrition-item">
                    <h1 className="beer-info-header">Style:</h1> 
                    <p>{beerToDisplay.Style}</p>
                </div>
                <div className="nutrition-item">
                    <h1 className="beer-info-header">ABV:</h1> 
                    <p>{beerToDisplay.ABV}%</p>
                </div>
                <div className="nutrition-item">
                    <h1 className="beer-info-header">Calories:</h1> 
                    <p>{beerToDisplay.Calories}</p>
                </div>
                <div className="nutrition-item">
                    <h1 className="beer-info-header">Origin:</h1> 
                    <p>{beerToDisplay.Origin}</p>
                </div>
                <div className="nutrition-item">
                    <h1 className="beer-info-header">Favorite?</h1>
                    <div className="fav-button-container-in-list">
                        <FavButton drink={beerToDisplay} />
                    </div>
                </div>
                <button onClick={switchComp} className = "ratings-button">Rate Beer<i className="bi bi-arrow-right"></i></button>
            </div>
        </div>
    );
}

export default BeerNutritionFacts;