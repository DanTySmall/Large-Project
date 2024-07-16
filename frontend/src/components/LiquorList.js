import React, {useState, useEffect, useContext} from 'react';
import '../main.css';
import '../css/LiquorPage.css';
import CocktailGlass from '../images/cocktail-list-header.png';
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
            const allLiquors = await fetchAllLiquors();
    
            //Change when we get the function to
            //return the liquors that the user has favorited
            if (filterSelection === "fav") {
                setShowDisplayLiquor(false);
                const FavLiqFilter = allLiquors.filter(liquor => liquor.Favorites && liquor.Favorites.some(user => user === userID || user.UserId === userID));
                setValidSearch(true);
                setSearchResults([]);
                setSearchResults(FavLiqFilter);

            }
            else if (filterSelection === "whiskey") {
                setShowDisplayLiquor(false);
                const WhiskeyFilter = allLiquors.filter(liquor => (liquor.Style === 'Whiskey') || (liquor.Style === 'Scotch'));
                setValidSearch(true);
                setSearchResults([]);
                setSearchResults(WhiskeyFilter);
            }
            else if(filterSelection === "vodka"){
                setShowDisplayLiquor(false);
                const VodkaFilter = allLiquors.filter(liquor => (liquor.Style === 'Vodka'));
                setValidSearch(true);
                setSearchResults([]);
                setSearchResults(VodkaFilter);
            }
            else if (filterSelection === "rum") {
                setShowDisplayLiquor(false);
                const RumFilter = allLiquors.filter(liquor => (liquor.Style === 'Rum'));
                setValidSearch(true);
                setSearchResults([]);
                setSearchResults(RumFilter);
            }
            else if (filterSelection === "gin") {
                setShowDisplayLiquor(false);
                const GinFilter = allLiquors.filter(liquor => (liquor.Style === 'Gin'));
                setValidSearch(true);
                setSearchResults([]);
                setSearchResults(GinFilter);
            }
            else if (filterSelection === "tequila") {
                setShowDisplayLiquor(false);
                const TequilaFilter = allLiquors.filter(liquor => (liquor.Style === 'Tequila'));
                setValidSearch(true);
                setSearchResults([]);
                setSearchResults(TequilaFilter);
            }
            else if (filterSelection === "brandy") {
                setShowDisplayLiquor(false);
                const BrandyFilter = allLiquors.filter(liquor => (liquor.Style === 'Brandy') || (liquor.Style === 'Cognac'));
                setValidSearch(true);
                setSearchResults([]);
                setSearchResults(BrandyFilter);
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
                <img src = {CocktailGlass} alt=""></img>
                <h1> Liquor List </h1>
                <img src = {CocktailGlass} alt=""></img>
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
                    <option value="whiskey">Whiskey and Scotch</option>
                    <option value="vodka">Vodka</option>
                    <option value="rum">Rum</option>
                    <option value="gin">Gin</option>
                    <option value="tequila">Tequila</option>
                    <option value="brandy">Brandy and Congac</option>
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
