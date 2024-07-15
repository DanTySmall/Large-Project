import '../main.css';
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from './userProvider';

const LiquorFavButton = ({drink = {} }) =>{
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
    },  [userID, drink]);

    async function checkFav(){
        console.log('Checking fav status');
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
        console.log('Change Fav clicked');
        if (favBoolean) {
            await unfavLiquor();
        } else {
            await favLiquor();
        }
    };

    async function unfavLiquor(){
        try{
            const resp = await axios.post(buildPath('api/unfavoriteLiquor'), {
                _id: drink._id,
                UserId: userID
            });
            if(resp.status === 200){
                setFavBoolean(false);
            }
        }
        catch(error){
            console.log("Error while un-favoriting", error);
        }
    }

    async function favLiquor(){
        try{
            const resp = await axios.post(buildPath('api/favoriteLiquor'), {
                _id: drink._id,
                UserId: userID
            });
            if(resp.status === 200){
                setFavBoolean(true);
            }
        }
        catch(error){
            console.log("Error while favoriting", error);
        }
    }

    return(
        <button className = "fav-button" onClick = {changeFav}>
            {favBoolean ? <i className="bi bi-heart-fill"></i> : <i className = "bi bi-heart"></i>}
        </button>
    )
}

export default LiquorFavButton;