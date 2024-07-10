import React from 'react';

const Ratings = ({beerToDisplay, switchComp}) => {
    return(
        <div>
            <h1>{beerToDisplay.Name}</h1>
            <div class = "ratings-info">
                <h1 class = "beer-info-header">Average Rating: </h1>
                    <div className = "average-rating-container">
                        <i class="bi bi-star"></i>
                        <i class="bi bi-star"></i>
                        <i class="bi bi-star"></i>
                        <i class="bi bi-star"></i>
                        <i class="bi bi-star"></i>
                    </div>
                    <br></br>
                <h1 class = "beer-info-header">Rate Beer: </h1>
                    <div className = "my-rating-container">
                        <i class="bi bi-star"></i>
                        <i class="bi bi-star"></i>
                        <i class="bi bi-star"></i>
                        <i class="bi bi-star"></i>
                        <i class="bi bi-star"></i>
                    </div>
                <button onClick={switchComp} className = "ratings-button"><i className="bi bi-arrow-left"></i>Back</button>
            </div>
        </div>
    );
}
export default Ratings;