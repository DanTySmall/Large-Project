import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../main.css';
import BeerMugsLeft from '../images/beer-mugs-left.png';
import BeerMugsRight from '../images/beer-mugs-right.png';

const BeerOfTheDay = ({switchComponents}) => {

    const [officialBeerOfTheDay, setOfficialBeerOfTheDay] = useState(null);

    useEffect(() => {
        // Function to fetch all beers and set beer of the day
        async function fetchAllBeersAndSetBeerOfTheDay() {
            try {
                const response = await axios.get('http://localhost:5000/api/getAllBeers');
                const beers = response.data.beers;

                // Check local storage for saved beer of the day
                let savedBeer = JSON.parse(localStorage.getItem('beerOfTheDay'));

                // If there's a saved beer and it's valid for today, use it
                if (savedBeer && isBeerValidForToday(savedBeer)) {
                    setOfficialBeerOfTheDay(savedBeer.beer);
                } else {
                    // Otherwise, select a random beer
                    const randomBeer = selectBeerOfTheDay(beers);
                    setOfficialBeerOfTheDay(randomBeer);

                    // Save the selected beer along with today's date to local storage
                    localStorage.setItem('beerOfTheDay', JSON.stringify({
                        beer: randomBeer,
                        date: new Date().toDateString()
                    }));
                }
            } catch (error) {
                console.error("Error fetching beers:", error);
            }
        }

        // Function to select random beer from beers array
        function selectBeerOfTheDay(beers) {
            const rand = Math.floor(Math.random() * beers.length);
            return beers[rand];
        }

        // Function to check if saved beer is valid for today
        function isBeerValidForToday(savedBeer) {
            const savedDate = new Date(savedBeer.date);
            const currentDate = new Date();
            return savedDate.toDateString() === currentDate.toDateString();
        }

        // Fetch beers and set beer of the day when component mounts
        fetchAllBeersAndSetBeerOfTheDay();

        // Setup interval to check and update beer of the day at midnight
        const interval = setInterval(() => {
            fetchAllBeersAndSetBeerOfTheDay();
        }, 60 * 60 * 1000); // Check every hour

        // Cleanup function to clear interval when component unmounts
        return () => clearInterval(interval);
    }, []);

    return(
        <div class = "beer-of-the-day" id = "BOTD">
            <div>
                <img src = {BeerMugsLeft}></img>
                <h1>——— Beer of the Day ———</h1>
                <img src = {BeerMugsRight}></img>
            </div>
            <div className="botd-content">
                {officialBeerOfTheDay && (
                    <div className="botd-nutri-values">
                        <h2>Name: {officialBeerOfTheDay.Name}</h2>
                        <div className="grid">
                            <div className="grid-item"><h1 class = "grid-header">Company:</h1><br />{officialBeerOfTheDay.Company}</div>

                            <div className="grid-item"><h1 class = "grid-header">Style:</h1><br />{officialBeerOfTheDay.Style}</div>

                            <div className="grid-item"><h1 class = "grid-header">ABV:</h1><br />{officialBeerOfTheDay.ABV}</div>

                            <div className="grid-item"><h1 class = "grid-header">Calories:</h1><br />{officialBeerOfTheDay.Calories}</div>

                            <div className="grid-item"><h1 class = "grid-header">Origin:</h1><br />{officialBeerOfTheDay.Origin}</div>

                            <div className="grid-item"><h1 class = "grid-header">Favorite?</h1><br />{officialBeerOfTheDay.Favorite ? <i className = "bi bi-heart-fill fav-icon"></i> : <i className = "bi bi-heart fav-icon"></i>}</div>
                        </div>
                    </div>
                )}
                <button onClick={switchComponents} class = "beer-list-button">Full beer list<i class="bi bi-arrow-right"></i></button>
            </div>
        </div>
    );
}

export default BeerOfTheDay;