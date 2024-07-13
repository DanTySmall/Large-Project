import React, {useState, useEffect, useContext} from 'react';
import '../main.css';
import '../css/WinePage.css';
import WineGlass from '../images/wine-glass.png';
import axios from 'axios';
import DisplayWine from './DisplayWine.js';
import { UserContext } from './userProvider';


const WineList = () => {
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
    const [wines, setWines] = useState([]);
    const [selectedWine, setSelectedWine] = useState(null);
    const [showDisplayWine, setShowDisplayWine] = useState(false);
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
    }, [searchResults]);

    useEffect(() => {
        async function fetchAllWines(){
            try {
                const response = await axios.get(buildPath('api/getAllWines'));
                let winesData = response.data.wines;
                winesData.sort((a, b) => a.Name.localeCompare(b.Name));
                setWines(winesData);
            }
            catch(error){
                console.log("Error fetching all wines: ", error);
            }
        }

        fetchAllWines();
    }, []);

    const handleBeerClick = (wine) => {
        setSelectedWine(wine);
        setShowDisplayWine(true);
    };

    const [text, setText] = useState('');
    const [validSearch, setValidSearch] = useState(true);

    const handleBlur = () => {
        if(text === ''){
            document.getElementById('beer-search-bar').value = 'Search';
        }
    }

    const handleFocus = () => {
        if(text === ''){
            document.getElementById('beer-search-bar').value = '';
        }
    }

    async function handleSearch(){
        document.getElementById('beer-search-bar').value = 'Search';

        try{
            const resp = await axios.post(buildPath('api/searchWine'), {
                Name: text
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            setValidSearch(true);
            setSearchResults([]);
            setSearchResults(resp.data.wine);
            setText('');
        }
        catch(error){
            setValidSearch(false);
            setText('');
            console.log("Error handling search...");
        }
    }

    async function handleSearchBackButton(){
        setSearchResults([]);
        setValidSearch(true);
        showDisplayWine(!setShowDisplayWine);
    }

    const [filterSelection, setFilterSelection] = useState('');
    const [filteredBeers, setFilteredBeers] = useState([]);

    async function fetchAllWines(){
        try {
            const response = await axios.get(buildPath('api/getAllWines'));
            let winesData = response.data.wines;
            return winesData;
        }
        catch(error){
            console.log("Error fetching all wines: ", error);
        }
    }

    useEffect(() => {
        async function getList() {
            const allBeers = await fetchAllWines();
    
            //Change when we get the function to
            //return the beers that the user has favorited
            if (filterSelection === "fav") {
                setShowDisplayWine(false);
                const FavBeerFilter = allBeers.filter(beer => beer.Favorites && beer.Favorites.some(user => user === userID || user.UserId === userID));
                setValidSearch(true);
                setSearchResults([]);
                setSearchResults(FavBeerFilter);

            }
            else if (filterSelection === "IPAs") {
                setShowDisplayWine(false);
                const IPAsBeerFilter = allBeers.filter(beer => (beer.Style === 'IPA') && ((beer.ABV >= 5.0) && (beer.ABV <= 7.5)));
                setValidSearch(true);
                setSearchResults([]);
                setSearchResults(IPAsBeerFilter);
            }
            else if(filterSelection === "DoubleIPAs"){
                setShowDisplayWine(false);
                const doubleIPAsBeerFilter = allBeers.filter(beer => beer.ABV > 7.5);
                setValidSearch(true);
                setSearchResults([]);
                setSearchResults(doubleIPAsBeerFilter);
            }
            else if (filterSelection === "calories") {
                setShowDisplayWine(false);
                const caloriesBeerFilter = allBeers.filter(beer => beer.Calories < 125);
                setValidSearch(true);
                setSearchResults([]);
                setSearchResults(caloriesBeerFilter);
            }
            else if (filterSelection === "origin") {
                setShowDisplayWine(false);
                const originBeerFilter = allBeers.filter(beer => beer.Origin === "USA");
                setValidSearch(true);
                setSearchResults([]);
                setSearchResults(originBeerFilter);
            }
            else {
                setSearchResults([]);
                setValidSearch(true);
                setShowDisplayWine(false);
            }
        }
    
        getList();
    }, [filterSelection]);

    const handleFilterChange = (event) =>{
        const selection = event.target.value;
        setFilterSelection(selection);
    }


    return(
    <div className = "wine-list" id = "wineList">
        <div className = "wine-list-header">
                <img src = {WineGlass} alt=""></img>
                <h1> Wine List </h1>
                <img src = {WineGlass} alt=""></img>
        </div>
        <div className = "search-and-filter">
            <div className="search-container">
                <input id="wine-search-bar" placeholder="Search" className="search-bar" type="text" onChange={(e) => setText(e.target.value)} onBlur={handleBlur} onFocus={handleFocus} />
                <button className="search-button" onClick={handleSearch} ><i className="bi bi-search"></i></button>
            </div>
            <div className="filter-container">
                <select className="filter-select" onChange={handleFilterChange}>
                    <option value="">Filter</option>
                    <option value="fav">Favorites</option>
                    <option value="IPAs">IPAs</option>
                    <option value="DoubleIPAs">Double IPAs (ABV &gt; 7.5)</option>
                    <option value="calories">Calories &lt; 125</option>
                    <option value="origin">Origin: USA</option>
                </select>
            </div>
        </div>
        <div className = "wine-list-content">
            <div className = "scrollable-box">
                {/* <p>searchResults : {searchResults.data}<br></br>validSearch: {validSearch.value}</p> */}

                {validSearch ? (searchResults.length === 0 ?
                                    (Array.isArray(wines) && wines.map(wine => (
                                        <ul id="sortedList" className = "sorted-list" key={wine._id}>
                                            <li className="wine-list-item" onClick={() => handleBeerClick(wine)}> {wine.Name} </li>
                                        </ul>
                ))) :
                                    (Array.isArray(searchResults) &&
                                        <>
                                            {searchResults.map(wine => (
                                                <ul id="sortedList" className = "sorted-list" key={wine._id}>
                                                    <li className="wine-list-item" onClick={() => handleBeerClick(wine)}> {wine.Name} </li>
                                                </ul>
                                            ))}
                                            <button className = "search-back-button" onClick = {handleSearchBackButton}><i className="bi bi-arrow-left"></i>Back</button>
                                        </>
                                    )) :
                        (<div>
                        <ul className = "sorted-list">
                            <li className="no-matches-message" > No wine matched with the criteria <br></br><i className="bi bi-emoji-frown"></i> </li>
                        </ul>
                        <button className = "search-back-button" onClick = {handleSearchBackButton}><i className="bi bi-arrow-left"></i>Back</button>
                        </div>)
            }



            </div>
            {validSearch && showDisplayWine && selectedWine && (
                <DisplayWine wine={selectedWine} />
            )}
        </div>
        {/* <button onClick={switchComponents} className = "beer-list-button"><i className="bi bi-arrow-left"></i>Back</button> */}
    </div>
    );
}

export default WineList;
