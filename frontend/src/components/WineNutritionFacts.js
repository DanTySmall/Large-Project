import React from 'react';
import FavButton from './FavButton.js';
import '../main.css';
import '../css/WinePage.css';

const WineNutritionFacts = ({wineToDisplay, switchComp}) => {
    return(
        <div>
            <h1>{wineToDisplay.Name}</h1>
            <div className = "wine-info">
                <div className="nutrition-item">
                    <h1 className="wine-info-header">Company: </h1> 
                    <p>{wineToDisplay.Company}</p>
                </div>
                <div className="nutrition-item">
                    <h1 className="wine-info-header">Style:</h1> 
                    <p>{wineToDisplay.Style}</p>
                </div>
                <div className="nutrition-item">
                    <h1 className="wine-info-header">ABV:</h1> 
                    <p>{wineToDisplay.ABV}%</p>
                </div>
                <div className="nutrition-item">
                    <h1 className="wine-info-header">Calories:</h1> 
                    <p>{wineToDisplay.Calories}</p>
                </div>
                <div className="nutrition-item">
                    <h1 className="wine-info-header">Origin:</h1> 
                    <p>{wineToDisplay.Origin}</p>
                </div>
                <div className="nutrition-item">
                    <h1 className="wine-info-header">Favorite?</h1>
                    <div className="fav-button-container-in-list">
                        <FavButton currentWine={wineToDisplay} />
                    </div>
                </div>
                <button onClick={switchComp} className = "ratings-button">Rate Wine<i className="bi bi-arrow-right"></i></button>
            </div>
        </div>
    );
}

export default WineNutritionFacts;