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
    const [filterSelection, setFilterSelection] = useState('');
    const [text, setText] = useState('');
    const [validSearch, setValidSearch] = useState(true);    
    const [selectedFilterLabel, setSelectedFilterLabel] = useState('');

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

    const handleWineClick = (wine) => {
        setSelectedWine(wine);
        setShowDisplayWine(true);
    };

    const handleBlur = () => {
        if(text === ''){
            document.getElementById('wine-search-bar').value = 'Search';
        }
    }

    const handleFocus = () => {
        if(text === ''){
            document.getElementById('wine-search-bar').value = '';
        }
    }

    async function handleSearch(){
        document.getElementById('wine-search-bar').value = 'Search';

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
        setShowDisplayWine(!showDisplayWine);
    }

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
            const allWines = await fetchAllWines();
    
            //Change when we get the function to
            //return the wines that the user has favorited
            if (filterSelection === "fav") {
                setShowDisplayWine(false);
                const FavWineFilter = allWines.filter(wine => wine.Favorites && wine.Favorites.some(user => user === userID || user.UserId === userID));
                setValidSearch(true);
                setSearchResults([]);
                setSearchResults(FavWineFilter);

            }
            else if (filterSelection === "red") {
                setShowDisplayWine(false);
                const RedWineFilter = allWines.filter(wine => (wine.Style === 'Red'));
                setValidSearch(true);
                setSearchResults([]);
                setSearchResults(RedWineFilter);
            }
            else if(filterSelection === "white"){
                setShowDisplayWine(false);
                const WhiteWineFilter = allWines.filter(wine => (wine.Style === 'White'));
                setValidSearch(true);
                setSearchResults([]);
                setSearchResults(WhiteWineFilter);
            }
            else if(filterSelection === "sparkling"){
                setShowDisplayWine(false);
                const SparklingWineFilter = allWines.filter(wine => (wine.Style === 'Sparkling'));
                setValidSearch(true);
                setSearchResults([]);
                setSearchResults(SparklingWineFilter);
            }
            else if (filterSelection === "calories") {
                setShowDisplayWine(false);
                const caloriesWineFilter = allWines.filter(wine => wine.Calories < 125);
                setValidSearch(true);
                setSearchResults([]);
                setSearchResults(caloriesWineFilter);
            }
            else if (filterSelection === "origin") {
                setShowDisplayWine(false);
                const originWineFilter = allWines.filter(wine => wine.Origin === "USA");
                setValidSearch(true);
                setSearchResults([]);
                setSearchResults(originWineFilter);
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
        const selectedLabel = event.target.options[event.target.selectedIndex].text;
        setSelectedFilterLabel(selectedLabel);
    }

    const handleClearFilter = () => {
        setFilterSelection('');
        setSelectedFilterLabel('');
        setSearchResults([]);
        setValidSearch(true);
        setShowDisplayWine(false);
    };


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
                <select className="filter-select" onChange={handleFilterChange} value={filterSelection}>
                    <option value="">Filter</option>
                    <option value="fav">Favorites</option>
                    <option value="red">Red</option>
                    <option value="white">White</option>
                    <option value="sparkling">Sparkling</option>
                    <option value="calories">Calories &lt; 125</option>
                    <option value="origin">Origin: USA</option>
                </select>
                {selectedFilterLabel && (
                        <i className="bi bi-x-circle clear-filter-button" onClick={handleClearFilter}></i>
                )}
            </div>
        </div>
        <div className = "wine-list-content">
            <div className = "scrollable-box">
                {validSearch ? (searchResults.length === 0 ?
                                    (Array.isArray(wines) && wines.map(wine => (
                                        <ul id="sortedList" className = "sorted-list" key={wine._id}>
                                            <li className="wine-list-item" onClick={() => handleWineClick(wine)}> {wine.Name} </li>
                                        </ul>
                ))) :
                                    (Array.isArray(searchResults) &&
                                        <>
                                            {searchResults.map(wine => (
                                                <ul id="sortedList" className = "sorted-list" key={wine._id}>
                                                    <li className="wine-list-item" onClick={() => handleWineClick(wine)}> {wine.Name} </li>
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
