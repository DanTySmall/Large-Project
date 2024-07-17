import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';

const Ratings = ({beerToDisplay, switchComp}) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);


    const pastRatings = [5, 4, 3, 5, 2, 4, 5]; // Example ratings array

    const scrollLeft = () => {
        setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : pastRatings.length - 1));
    };

    const scrollRight = () => {
        setCurrentIndex((prevIndex) => (prevIndex < pastRatings.length - 1 ? prevIndex + 1 : 0));
    };

    async function handleClick(starRating){
        setRating(starRating);
        //Also need to call the rateBeer API endpoint when I am able to get the UserId
    }

    const handleMouseEnter = (star) => {
        if(rating === 0){
            setHoverRating(star);
        }
    };

    const handleMouseLeave = () => {
        setHoverRating(0);
    };

    useEffect(() => {
        // getRatings(beerToDisplay);
    }, [beerToDisplay]);

    // async function getRatings(beer){
    //     try{
    //         const response = await axios.get('http://localhost:5000/api/beerRatings', {
    //                 _id: beer._id
    //             }
    //         );

    //         console.log(response);
    //     }
    //     catch(error){
    //         console.log(error);
    //     }
    // }

    return(
        <div>
            <h1>{beerToDisplay.Name}</h1>
            <div className = "ratings-info">
                <h1 className = "beer-info-header">Average Rating: </h1>
                <div className = "average-rating-container">
                    <i className="bi bi-star rating-star"></i>
                    <i className="bi bi-star rating-star"></i>
                    <i className="bi bi-star rating-star"></i>
                    <i className="bi bi-star rating-star"></i>
                    <i className="bi bi-star rating-star"></i>
                </div>


                <br></br>


                {/* Also add a place to scroll through the reviews*/}
                <div className = "ratings-scroller-container">
                    <div className = "arrow-div">
                        <button className = "arrow" onClick={scrollLeft}>
                            <p className="left-arrow">&lt;</p>
                        </button>
                    </div>
                    <div className="ratings-box">
                        <div className = "cur-displayed-rating">
                            {pastRatings[currentIndex]}
                        </div>
                    </div>
                    <div className = "arrow-div">
                        <button className = "arrow" onClick={scrollRight}>
                            <p className="right-arrow">&gt;</p>
                        </button>
                    </div>
                </div>


                <br></br>


                <h1 className = "beer-info-header">Rate Beer: </h1>
                <div className="my-rating-container">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <i
                            key={star}
                            className={`bi rating-star ${(star <= rating) || (star <= hoverRating) ? 'bi-star-fill' : 'bi-star'} ${star <= rating ? 'within-rating-star' : ''}`}
                            onClick={() => handleClick(star)}
                            onMouseEnter={() => handleMouseEnter(star)}
                            onMouseLeave={handleMouseLeave}
                            style={{ cursor: 'pointer', color: star <= rating ? 'gold' : '#353432'}}
                        ></i>
                    ))}
                </div>
                <div className="comment-container">
                    <input placeholder="Comment" className="comment-bar" type="text" onChange={(e) => setComment(e.target.value)} />
                    <button className="comment-button" /*onClick={handleComment}*/ ><i className="bi bi-arrow-up-circle"></i></button>
                </div>
                <button onClick={switchComp} className = "ratings-button"><i className="bi bi-arrow-left"></i>Back</button>
            </div>
        </div>
    );
}
export default Ratings;