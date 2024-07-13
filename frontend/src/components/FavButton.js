import '../main.css';
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from './userProvider';

const FavButton = ({drink}) =>{
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
        if (userID && drink) {
            checkFav();
        }
    });

    async function checkFav(){
        if(drink?.Favorites?.length > 0){
            //Change to compare the id to the current user (6 = Connor's User ID)
            if(drink.Favorites.some(user => user === userID || user?.UserId === userID)){
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
        await checkFav();
    };

    async function unfavBeer(){
        try{
            if (drink.Favorites.includes(userID) || drink.Favorites.some(user => user?.UserId === userID)) {
                await axios.post(buildPath('api/unfavoriteBeer'), {
                    _id: drink._id,
                    UserId: userID
                });

                setFavBoolean(false);
            }
        }
        catch(error){
            console.log("Error while un-favoriting", error);
        }
    }

    async function favBeer(){
        try{
            if (!drink.Favorites.includes(userID) && !drink.Favorites.some(user => user?.UserId === userID)) {
                await axios.post(buildPath('api/favoriteBeer'), {
                    _id: drink._id,
                    UserId: userID
                });

                setFavBoolean(true);
            }
        }
        catch(error){
            console.log("Error while favoriting", error);
        }
    }

    return(
        <button className = "fav-button" onClick = {changeFav}>{favBoolean ? <i className="bi bi-heart-fill"></i> : <i className = "bi bi-heart"></i>}</button>
    )
}

export default FavButton;