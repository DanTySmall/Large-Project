import '../main.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FavButton = ({currentBeer}) =>{
    const [favBoolean, setFavBoolean] = useState(false);

    useEffect(() => {
        checkFav();
    }, [currentBeer]);

    async function checkFav(){
        if(currentBeer?.Favorites?.length > 0){
            //Change to compare the id to the current user (6 = Connor's User ID)
            if((currentBeer.Favorites.some(user => user._id === 6))){
                setFavBoolean(true);
            }
            else{
                setFavBoolean(false);
            }
        }
        else{
            setFavBoolean(false);
        }
    }

    const changeFav = async () => {
        if (favBoolean) {
            unfavBeer();
        } else {
            favBeer();
        }
    };

    async function unfavBeer(){
        try{
            const beer = await axios.post('http://localhost:5000/api/unfavoriteBeer', {
                _id: currentBeer._id,
                UserId: 6
            });

            setFavBoolean(false);
        }
        catch(error){
            console.log("Error while un-favoriting");
        }
    }

    async function favBeer(){
        try{
            const beerName = currentBeer.Name;
            const beer = await axios.post('http://localhost:5000/api/favoriteBeer', {
                _id: currentBeer._id,
                UserId: 6
            });

            const resp = await axios.post('http://localhost:5000/api/searchBeer', {
                Name: beerName
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            setFavBoolean(true);
        }
        catch(error){
            console.log("Error while favoriting");
        }
    }

    return(
        <button className = "fav-button" onClick = {changeFav}>{favBoolean ? <i className="bi bi-heart-fill"></i> : <i className = "bi bi-heart"></i>}</button>
    )
}

export default FavButton;