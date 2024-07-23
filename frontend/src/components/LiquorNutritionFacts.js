import React from 'react';
import LiquorFavButton from './LiquorFavButton.js';
import '../main.css';
import '../css/LiquorPage.css';

const LiquorNutritionFacts = ({liquorToDisplay, switchComp}) => {
    return(
        <div>
            <h1>{liquorToDisplay.Name}</h1>
            <div className = "liq-info">
                <div className="nutrition-item">
                    <h1 className="liq-info-header">Company: </h1> 
                    <p>{liquorToDisplay.Company}</p>
                </div>
                <div className="nutrition-item">
                    <h1 className="liq-info-header">Style:</h1> 
                    <p>{liquorToDisplay.Style}</p>
                </div>
                <div className="nutrition-item">
                    <h1 className="liq-info-header">ABV:</h1> 
                    <p>{liquorToDisplay.ABV}%</p>
                </div>
                <div className="nutrition-item">
                    <h1 className="liq-info-header">Calories:</h1> 
                    <p>{liquorToDisplay.Calories}</p>
                </div>
                <div className="nutrition-item">
                    <h1 className="liq-info-header">Origin:</h1> 
                    <p>{liquorToDisplay.Origin}</p>
                </div>
                <div className="nutrition-item">
                    <h1 className="liq-info-header">Favorite?</h1>
                    <div className="fav-button-container-in-list">
                        <LiquorFavButton drink={liquorToDisplay} />
                    </div>
                </div>
                <button onClick={switchComp} className = "liquor-ratings-button">Rate Liquor<i className="bi bi-arrow-right"></i></button>
            </div>
        </div>
    );
}

export default LiquorNutritionFacts;