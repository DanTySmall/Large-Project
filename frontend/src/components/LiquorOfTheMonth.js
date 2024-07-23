import React, {useState, useEffect, useContext} from 'react';
import '../main.css';
import '../css/LiquorPage.css';
import CocktailGlass from '../images/cocktail-list-header.png';
import axios from 'axios';
import DisplayLiquor from './DisplayLiquor.js';
import { UserContext } from './userProvider';
import LiquorFavButton from './LiquorFavButton.js';

const LiquorOfTheMonth = ({switchComponents}) => {
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

    const [officialLiquorOfTheMonth, setOfficialLiquorOfTheMonth] = useState(null);

    useEffect(() => {
        async function fetchAllLiquorsAndSetLiquorOfTheMonth() {
            try {
                const response = await axios.get(buildPath('api/getAllLiquors'));
                const liquors = response.data.liquors;

                let savedLiquor = JSON.parse(localStorage.getItem('liquorOfTheMonth'));

                if (savedLiquor && isLiquorValidForThisMonth(savedLiquor)) {
                    const updatedLiquor = await fetchUpdatedLiquorInfo(savedLiquor.liquor);
                    setOfficialLiquorOfTheMonth(updatedLiquor);
                } else {
                    const randomLiquor = selectLiquorOfTheMonth(liquors);
                    const updatedLiquor = await fetchUpdatedLiquorInfo(randomLiquor);
                    setOfficialLiquorOfTheMonth(updatedLiquor);

                    localStorage.setItem('liquorOfTheMonth', JSON.stringify({
                        liquor: updatedLiquor,
                        date: new Date().toDateString()
                    }));
                }
            } catch (error) {
                console.error("Error fetching liquors:", error);
            }
        }

        function selectLiquorOfTheMonth(liquors) {
            const rand = Math.floor(Math.random() * liquors.length);
            return liquors[rand];
        }

        function isLiquorValidForThisMonth(savedLiquor) {
            const savedDate = new Date(savedLiquor.date);
            const currentDate = new Date();
            
            return savedDate.getMonth() === currentDate.getMonth();
        }

        async function fetchUpdatedLiquorInfo(liquor) {
            try {
                const response = await axios.post(buildPath('api/searchLiquor'), { Name: liquor?.Name });
                if (response.data.liquor.length > 0) {
                    return response.data.liquor[0];
                }
                return liquor;
            } catch (error) {
                console.error("Error fetching updated liquor info:", error);
                return liquor;
            }
        }

        fetchAllLiquorsAndSetLiquorOfTheMonth();

        const interval = setInterval(() => {
            fetchAllLiquorsAndSetLiquorOfTheMonth();
        }, 24 * 60 * 60 * 1000); // Check every 24 hours

        return () => clearInterval(interval);
    }, []);

    return(
        <div className = "liquor-of-the-month" id = "BOTD">
            <div className = "liq-list-header">
                <img src = {CocktailGlass} alt=""></img>
                <h1> Liquor of the Month </h1>
                <img src = {CocktailGlass} alt=""></img>
            </div>
            <div className="lotm-content">
                {officialLiquorOfTheMonth && (
                    <div className="lotm-nutri-values">
                        <h2>Name: {officialLiquorOfTheMonth.Name}</h2>
                        <div className="grid">
                            <div className="grid-item"><h1 className = "grid-header">Company:</h1><br />{officialLiquorOfTheMonth.Company}</div>

                            <div className="grid-item"><h1 className = "grid-header">Style:</h1><br />{officialLiquorOfTheMonth.Style}</div>

                            <div className="grid-item"><h1 className = "grid-header">ABV:</h1><br />{officialLiquorOfTheMonth.ABV}%</div>

                            <div className="grid-item"><h1 className = "grid-header">Calories:</h1><br />{officialLiquorOfTheMonth.Calories}</div>

                            <div className="grid-item"><h1 className = "grid-header">Origin:</h1><br />{officialLiquorOfTheMonth.Origin}</div>

                            <div className="grid-item"><h1 className = "grid-header">Favorite?</h1><div className="fav-button-container"><LiquorFavButton drink={officialLiquorOfTheMonth} /></div></div>
                        </div>
                    </div>
                )}
            </div>
            <button onClick={switchComponents} className = "liq-list-button">Explore Our Full Liquor Selection</button>
        </div>
    );
}

export default LiquorOfTheMonth;
