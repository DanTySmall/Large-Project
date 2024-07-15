import React, {useState, useEffect, useContext} from 'react';
import '../main.css';
import '../css/LiquorPage.css';
import CocktaiGlass from '../images/cocktail-list-header.png';
import axios from 'axios';
import { UserContext } from './userProvider';
import DisplayLiquor from './DisplayLiquor.js';


const LiquorList = () => {
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
    const [liquors, setLiquors] = useState([]);
    const [selectedLiquor, setSelectedLiquor] = useState(null);
    const [showDisplayLiquor, setShowDisplayLiquor] = useState(false);
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
    }, [searchResults]);

    useEffect(() => {
        async function fetchAllLiquors(){
            try {
                const response = await axios.get(buildPath('api/getAllLiquors'));
                let liquorsData = response.data.liquors;
                liquorsData.sort((a, b) => a.Name.localeCompare(b.Name));
                setLiquors(liquorsData);
            }
            catch(error){
                console.log("Error fetching all liquors: ", error);
            }
        }

        fetchAllLiquors();
    }, []);

    const handleBeerClick = (liquor) => {
        setSelectedLiquor(liquor);
        setShowDisplayLiquor(true);
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
            const resp = await axios.post(buildPath('api/searchLiquor'), {
                Name: text
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            setValidSearch(true);
            setSearchResults([]);
            setSearchResults(resp.data.liquor);
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
        showDisplayLiquor(!setShowDisplayLiquor);
    }

    const [filterSelection, setFilterSelection] = useState('');
    const [filteredBeers, setFilteredBeers] = useState([]);

    async function fetchAllLiquors(){
        try {
            const response = await axios.get(buildPath('api/getAllLiquors'));
            let liquorsData = response.data.liquors;
            return liquorsData;
        }
        catch(error){
            console.log("Error fetching all liquors: ", error);
        }
    }

    useEffect(() => {
        async function getList() {
            const allBeers = await fetchAllLiquors();
    
            //Change when we get the function to
            //return the liquors that the user has favorited
            if (filterSelection === "fav") {
                setShowDisplayLiquor(false);
                const FavLiqFilter = allBeers.filter(liquor => liquor.Favorites && liquor.Favorites.some(user => user === userID || user.UserId === userID));
                setValidSearch(true);
                setSearchResults([]);
                setSearchResults(FavLiqFilter);

            }
            else if (filterSelection === "IPAs") {
                setShowDisplayLiquor(false);
                const IPAsBeerFilter = allBeers.filter(liquor => (liquor.Style === 'IPA') && ((liquor.ABV >= 5.0) && (liquor.ABV <= 7.5)));
                setValidSearch(true);
                setSearchResults([]);
                setSearchResults(IPAsBeerFilter);
            }
            else if(filterSelection === "DoubleIPAs"){
                setShowDisplayLiquor(false);
                const doubleIPAsBeerFilter = allBeers.filter(beer => beer.ABV > 7.5);
                setValidSearch(true);
                setSearchResults([]);
                setSearchResults(doubleIPAsBeerFilter);
            }
            else if (filterSelection === "calories") {
                setShowDisplayLiquor(false);
                const caloriesBeerFilter = allBeers.filter(beer => beer.Calories < 125);
                setValidSearch(true);
                setSearchResults([]);
                setSearchResults(caloriesBeerFilter);
            }
            else if (filterSelection === "origin") {
                setShowDisplayLiquor(false);
                const originBeerFilter = allBeers.filter(beer => beer.Origin === "USA");
                setValidSearch(true);
                setSearchResults([]);
                setSearchResults(originBeerFilter);
            }
            else {
                setSearchResults([]);
                setValidSearch(true);
                setShowDisplayLiquor(false);
            }
        }
    
        getList();
    }, [filterSelection]);

    const handleFilterChange = (event) =>{
        const selection = event.target.value;
        setFilterSelection(selection);
    }


    return(
    <div className = "liq-list" id = "liqList">
        <div className = "liq-list-header">
                <img src = {CocktaiGlass} alt=""></img>
                <h1> Liquor List </h1>
                <img src = {CocktaiGlass} alt=""></img>
        </div>
        <div className = "search-and-filter">
            <div className="search-container">
                <input id="liq-search-bar" placeholder="Search" className="search-bar" type="text" onChange={(e) => setText(e.target.value)} onBlur={handleBlur} onFocus={handleFocus} />
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
        <div className = "liq-list-content">
            <div className = "scrollable-box">
                {/* <p>searchResults : {searchResults.data}<br></br>validSearch: {validSearch.value}</p> */}

                {validSearch ? (searchResults.length === 0 ?
                                    (Array.isArray(liquors) && liquors.map(liquor => (
                                        <ul id="sortedList" className = "sorted-list" key={liquor._id}>
                                            <li className="liq-list-item" onClick={() => handleBeerClick(liquor)}> {liquor.Name} </li>
                                        </ul>
                ))) :
                                    (Array.isArray(searchResults) &&
                                        <>
                                            {searchResults.map(liquor => (
                                                <ul id="sortedList" className = "sorted-list" key={liquor._id}>
                                                    <li className="liq-list-item" onClick={() => handleBeerClick(liquor)}> {liquor.Name} </li>
                                                </ul>
                                            ))}
                                            <button className = "search-back-button" onClick = {handleSearchBackButton}><i className="bi bi-arrow-left"></i>Back</button>
                                        </>
                                    )) :
                        (<div>
                        <ul className = "sorted-list">
                            <li className="no-matches-message" > No liquor matched with the criteria <br></br><i className="bi bi-emoji-frown"></i> </li>
                        </ul>
                        <button className = "search-back-button" onClick = {handleSearchBackButton}><i className="bi bi-arrow-left"></i>Back</button>
                        </div>)
            }



            </div>
            {validSearch && showDisplayLiquor && selectedLiquor && (
                <DisplayLiquor liquor={selectedLiquor} />
            )}
        </div>
    </div>
    );
}

export default LiquorList;
