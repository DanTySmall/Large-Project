import React, {useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from './userProvider';

const LiquorRatings = ({liquorToDisplay, switchComp}) => {
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

    useEffect(() => {
        getAverageRating(liquorToDisplay);
        getComments(liquorToDisplay);
    }, [liquorToDisplay]);

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
        try {
            const response = await axios.post(buildPath('api/rateLiquor'), {
                _id: liquorToDisplay._id,
                UserId: userID,
                Stars: rating,
                Comment: comment,
            });
            console.log(response.data);
            setComment('');
            setRating(0);
            getAverageRating(liquorToDisplay);
        } catch (error) {
            console.error('Error submitting rating:', error);
        }
    }

    async function getAverageRating(liquor) {
        try {
            const response = await axios.get(buildPath('api/liquorRatings'), {
                params: { _id: liquor._id }
            });
            setAverageRating(response.data.avgRating);
        } catch (error) {
            console.error('Error fetching average rating:', error);
        }
    }

    async function getComments(liquor) {
        try {
            const response = await axios.get(buildPath('api/getLiquorComments'), {
                params: { _id: liquor._id }
            });
            setComments(response.data.comments);
            setCurrentIndex(0);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    }


    return(
        <div>
            <h1>{liquorToDisplay.Name}</h1>
            <div className = "ratings-info">
                <h1 className = "liq-info-header">Average Rating: </h1>
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
                            {comments.length > 0 ? comments[currentIndex]?.Comment || 'No comments yet' : 'No comments yet'}
                        </div>
                    </div>
                    <div className = "arrow-div">
                        <button className = "arrow" onClick={scrollRight}>
                            <p className="right-arrow">&gt;</p>
                        </button>
                    </div>
                </div>


                <br></br>


                <h1 className = "liq-info-header">Rate Liquor: </h1>
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
export default LiquorRatings;