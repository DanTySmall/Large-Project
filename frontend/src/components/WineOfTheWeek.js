import React, {useState, useEffect, useContext} from 'react';
import '../main.css';
import '../css/WinePage.css';
import WineGlass from '../images/wine-glass1.png';
import axios from 'axios';
import DisplayWine from './DisplayWine.js';
import { UserContext } from './userProvider';
import WineFavButton from './WineFavButton.js';

const WineOfTheWeek = ({switchComponents}) => {
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

    const [officialWineOfTheWeek, setOfficialWineOfTheWeek] = useState(null);

    useEffect(() => {
        async function fetchAllWinesAndSetWineOfTheWeek() {
            try {
                const response = await axios.get(buildPath('api/getAllWines'));
                const wines = response.data.wines;

                let savedWine = JSON.parse(localStorage.getItem('wineOfTheWeek'));

                if (savedWine && isWineValidForThisWeek(savedWine)) {
                    const updatedWine = await fetchUpdatedWineInfo(savedWine.Wine);
                    setOfficialWineOfTheWeek(updatedWine);
                } else {
                    const randomWine = selectWineOfTheWeek(wines);
                    const updatedWine = await fetchUpdatedWineInfo(randomWine);
                    setOfficialWineOfTheWeek(updatedWine);

                    localStorage.setItem('wineOfTheWeek', JSON.stringify({
                        wine: updatedWine,
                        date: new Date().toDateString()
                    }));
                }
            } catch (error) {
                console.error("Error fetching wines:", error);
            }
        }

        function selectWineOfTheWeek(wines) {
            const rand = Math.floor(Math.random() * wines.length);
            return wines[rand];
        }

        function isWineValidForThisWeek(savedWine) {
            const savedDate = new Date(savedWine.date);
            const currentDate = new Date();

            const savedSunday = new Date(savedDate);
            savedSunday.setDate(savedSunday.getDate() - savedSunday.getDay());

            const currentSunday = new Date(currentDate);
            currentSunday.setDate(currentSunday.getDate() - currentSunday.getDay());

            return savedSunday.toDateString() === currentSunday.toDateString();
        }

        async function fetchUpdatedWineInfo(wine) {
            try {
                const response = await axios.post(buildPath('api/searchWine'), { Name: wine?.Name });
                if (response.data.wine.length > 0) {
                    return response.data.wine[0];
                }
                return wine;
            } catch (error) {
                console.error("Error fetching updated wine info:", error);
                return wine;
            }
        }

        fetchAllWinesAndSetWineOfTheWeek();

        const interval = setInterval(() => {
            fetchAllWinesAndSetWineOfTheWeek();
        }, 24 * 60 * 60 * 1000); // Check every 24 hours

        return () => clearInterval(interval);
    }, []);

    return(
        <div className = "wine-of-the-week" id = "BOTD">
            <div className = "wine-list-header">
                <img src = {WineGlass} alt=""></img>
                <h1> Wine of the Week </h1>
                <img src = {WineGlass} alt=""></img>
            </div>
            <div className="wotw-content">
                {officialWineOfTheWeek && (
                    <div className="wotw-nutri-values">
                        <h2>Name: {officialWineOfTheWeek.Name}</h2>
                        <div className="grid">
                            <div className="grid-item"><h1 className = "grid-header">Company:</h1><br />{officialWineOfTheWeek.Company}</div>

                            <div className="grid-item"><h1 className = "grid-header">Style:</h1><br />{officialWineOfTheWeek.Style}</div>

                            <div className="grid-item"><h1 className = "grid-header">ABV:</h1><br />{officialWineOfTheWeek.ABV}%</div>

                            <div className="grid-item"><h1 className = "grid-header">Calories:</h1><br />{officialWineOfTheWeek.Calories}</div>

                            <div className="grid-item"><h1 className = "grid-header">Origin:</h1><br />{officialWineOfTheWeek.Origin}</div>

                            <div className="grid-item"><h1 className = "grid-header">Favorite?</h1><div className="fav-button-container"><WineFavButton drink={officialWineOfTheWeek} /></div></div>
                        </div>
                    </div>
                )}
            </div>
            <button onClick={switchComponents} className = "wine-list-button">Explore Our Full Wine Selection</button>
        </div>
    );
}

export default WineOfTheWeek;
