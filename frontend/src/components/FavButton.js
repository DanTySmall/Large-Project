import '../main.css';
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from './userProvider';

const FavButton = ({currentBeer}) =>{
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
    
    const { userID } = useContext(UserContext);
    const [favBoolean, setFavBoolean] = useState(false);

    useEffect(() => {
        if (userID) {
            checkFav();
        }
    }, [currentBeer, userID]);

    async function checkFav(){
        if(currentBeer?.Favorites?.length > 0){
            //Change to compare the id to the current user (6 = Connor's User ID)
            if((currentBeer.Favorites.some(user => user === userID || user?.UserId === userID))){
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
            if (currentBeer.Favorites.includes(userID) || currentBeer.Favorites.some(user => user?.UserId === userID)) {
                await axios.post(buildPath('api/unfavoriteBeer'), {
                    _id: currentBeer._id,
                    UserId: userID
                });

                setFavBoolean(false);
            }
        }
        catch(error){
            console.log("Error while un-favoriting");
        }
    }

    async function favBeer(){
        try{
            if (!currentBeer.Favorites.includes(userID) && !currentBeer.Favorites.some(user => user?.UserId === userID)) {
                await axios.post(buildPath('api/favoriteBeer'), {
                    _id: currentBeer._id,
                    UserId: userID
                });

                setFavBoolean(true);
            }
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