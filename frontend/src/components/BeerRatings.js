import React, {useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from './userProvider';

const BeerRatings = ({beerToDisplay, switchComp}) => {
    const app_name = 'paradise-pours-4be127640468'
    function buildPath(route)
    {
        if (process.env.NODE_ENV === 'production')
        {
            return 'https://' + app_name + '.herokuapp.com/' + route;
        }
        else
        {
            return 'http://localhost:5000/' + route;
        }
    }

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [averageRating, setAverageRating] = useState(0);
    const { userID } = useContext(UserContext);
    const [comments, setComments] = useState([]);
    const [flag, setFlag] = useState(0);//Used to check if user already created a comment.

    useEffect(() => {
        getAverageRating(beerToDisplay);
        getComments(beerToDisplay);
        getUserRating(beerToDisplay);
    }, [beerToDisplay]);

    const scrollLeft = () => {
        setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : comments.length - 1));
    };

    const scrollRight = () => {
        setCurrentIndex((prevIndex) => (prevIndex < comments.length - 1 ? prevIndex + 1 : 0));
    };

    async function handleClick(starRating){
        setRating(starRating);
    }

    const handleMouseEnter = (star) => {
        if(rating === 0){
            setHoverRating(star);
        }
    };

    const handleMouseLeave = () => {
        setHoverRating(0);
    };

    async function handleComment() {
        if (flag === 1) {
            const confirmSubmit = window.confirm("Would you like to overwrite your existing comment?");
            if (!confirmSubmit) {
                return;
            }
        }
        try {
            const response = await axios.post(buildPath('api/rateBeer'), {
                _id: beerToDisplay._id,
                UserId: userID,
                Stars: rating,
                Comment: comment,
            });
            setComment('');
            setRating(0);
            getAverageRating(beerToDisplay);
            getComments(beerToDisplay)
            getUserRating(beerToDisplay)
            setFlag(1)
            console.log(1)
        } catch (error) {
            console.error('Error submitting rating:', error);
        }
    }

    async function getUserRating(beer) {
        try {
            const response = await axios.get(buildPath('api/userBeerRating'), {
                params: { UserId: userID, _id: beer._id }
            });
            setRating(response.data.userRating);
            setCurrentIndex(response.data.index);
            setFlag(1)
            console.log(flag)
        } catch (error) {
            setFlag(0)
            console.log(flag)
            console.error('User Rating does not exist', error);
        }
    }


    async function getAverageRating(beer) {
        try {
            const response = await axios.get(buildPath('api/beerRatings'), {
                params: { _id: beer._id }
            });
            setAverageRating(response.data.avgRating);
        } catch (error) {
            console.error('Error fetching average rating:', error);
        }
    }

    async function getComments(beer) {
        try {
            const response = await axios.get(buildPath('api/getBeerComments'), {
                params: { _id: beer._id }
            });
            setComments(response.data.comments);
            setCurrentIndex(0);
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    }

    return(
        <div>
            <h1>{beerToDisplay.Name}</h1>
            <div className = "ratings-info">
                <h1 className = "beer-info-header">Average Rating: </h1>
                <div className = "average-rating-container">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <i
                            key={star}
                            className={`bi rating-star ${star <= averageRating ? 'bi-star-fill' : 'bi-star'}`}
                            style={{ color: star <= averageRating ? 'gold' : '#353432' }}
                        ></i>
                    ))}
                </div>

                <br></br>

                <div className = "ratings-scroller-container">
                    <div className = "arrow-div">
                        <button className = "arrow" onClick={scrollLeft}>
                            <p className="left-arrow">&lt;</p>
                        </button>
                    </div>
                    <div className="ratings-box">
                        <div className = "cur-displayed-rating">
                            <div className = "comment-stars-container">
                                {comments.length > 0 ? ([1, 2, 3, 4, 5].map((star) => (
                                                            <i
                                                                key={star}
                                                                className={`bi comment-stars ${star <= comments[currentIndex]?.Rating ? 'bi-star-fill' : 'bi-star'}`}
                                                                style={{ color: star <= comments[currentIndex]?.Rating ? 'gold' : '#353432' }}
                                                            ></i>
                                                            )))
                                                    : ''}
                            </div>
                            <div className = "comment-box">
                                {comments.length > 0 ? comments[currentIndex]?.Comment || 'No comments yet' : 'No comments yet'}
                            </div>
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
                    <input placeholder="Comment" className="comment-bar" type="text" value={comment} onChange={(e) => setComment(e.target.value)} maxLength="50" />
                    <button className="comment-button" onClick={handleComment} ><i className="bi bi-arrow-up-circle"></i></button>
                </div>
                <button onClick={switchComp} className = "ratings-button"><i className="bi bi-arrow-left"></i>Back</button>
            </div>
        </div>
    );
}
export default BeerRatings;
