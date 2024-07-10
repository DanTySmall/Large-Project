import React, {useState, useEffect} from 'react';
import '../main.css';
import '../css/BeerPage.css';
import BeerMugsLeft from '../images/beer-mugs-left.png';
import BeerMugsRight from '../images/beer-mugs-right.png';
import axios from 'axios';
import DisplayBeer from './DisplayBeer.js';


const BeerList = ({switchComponents}) => {

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

    const [beers, setBeers] = useState([]);
    const [selectedBeer, setSelectedBeer] = useState(null);
    const [showDisplayBeer, setShowDisplayBeer] = useState(false);
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
    }, [searchResults]);

    useEffect(() => {
        async function fetchAllBeers(){
            try {
                //const response = await axios.get('http://localhost:5000/api/getAllBeers');
                const response = await axios.get(buildPath('api/getAllBeers'));
                let beersData = response.data.beers;
                beersData.sort((a, b) => a.Name.localeCompare(b.Name));
                setBeers(beersData);
            }
            catch(error){
                console.log("Error fetching all beers: ", error);
            }
        }

        fetchAllBeers();
    }, []);

    const handleBeerClick = (beer) => {
        setSelectedBeer(beer);
        setShowDisplayBeer(true);
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
            //const resp = await axios.post('http://localhost:5000/api/searchBeer', {
            const resp = await axios.post(buildPath('api/searchBeer'), {
                Name: text
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            setValidSearch(true);
            setSearchResults([]);
            setSearchResults(resp.data.beer);
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
        setShowDisplayBeer(!showDisplayBeer);
    }

    const [filterSelection, setFilterSelection] = useState('');
    const [filteredBeers, setFilteredBeers] = useState([]);

    async function fetchAllBeers(){
        try {
            const response = await axios.get('http://localhost:5000/api/getAllBeers');
            let beersData = response.data.beers;
            return beersData;
        }
        catch(error){
            console.log("Error fetching all beers: ", error);
        }
    }

    useEffect(() => {
        async function getList() {
            const allBeers = await fetchAllBeers();
    
            //Change when we get the function to
            //return the beers that the user has favorited
            if (filterSelection === "fav") {

            }
            else if (filterSelection === "IPAs") {
                setShowDisplayBeer(false);
                const IPAsBeerFilter = allBeers.filter(beer => (beer.ABV >= 5.0) && (beer.ABV <= 7.5));
                setValidSearch(true);
                setSearchResults([]);
                setSearchResults(IPAsBeerFilter);
            }
            else if(filterSelection === "DoubleIPAs"){
                setShowDisplayBeer(false);
                const doubleIPAsBeerFilter = allBeers.filter(beer => beer.ABV > 7.5);
                setValidSearch(true);
                setSearchResults([]);
                setSearchResults(doubleIPAsBeerFilter);
            }
            else if (filterSelection === "calories") {
                setShowDisplayBeer(false);
                const caloriesBeerFilter = allBeers.filter(beer => beer.Calories < 125);
                setValidSearch(true);
                setSearchResults([]);
                setSearchResults(caloriesBeerFilter);
            }
            else if (filterSelection === "origin") {
                setShowDisplayBeer(false);
                const originBeerFilter = allBeers.filter(beer => beer.Origin === "USA");
                setValidSearch(true);
                setSearchResults([]);
                setSearchResults(originBeerFilter);
            }
            else {
                setSearchResults([]);
                setValidSearch(true);
                setShowDisplayBeer(false);
            }
        }
    
        getList();
    }, [filterSelection]);

    const handleFilterChange = (event) =>{
        const selection = event.target.value;
        setFilterSelection(selection);
    }


    return(
    <div className = "beer-list" id = "beerList">
        <div className = "beer-list-header">
                <img src = {BeerMugsLeft} alt=""></img>
                <h1> Beer List </h1>
                <img src = {BeerMugsRight} alt=""></img>
        </div>
        <div className = "search-and-filter">
            <div className="search-container">
                <input id="beer-search-bar" placeholder="Search" className="search-bar" type="text" onChange={(e) => setText(e.target.value)} onBlur={handleBlur} onFocus={handleFocus} />
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
        <div className = "beer-list-content">
            <div className = "scrollable-box">
                {/* <p>searchResults : {searchResults.data}<br></br>validSearch: {validSearch.value}</p> */}

                {validSearch ? (searchResults.length === 0 ?
                                    (Array.isArray(beers) && beers.map(beer => (
                                        <ul id="sortedList" className = "sorted-list" key={beer._id}>
                                            <li className="list-item" onClick={() => handleBeerClick(beer)}> {beer.Name} </li>
                                        </ul>
                ))) :
                                    (Array.isArray(searchResults) &&
                                        <>
                                            {searchResults.map(beer => (
                                                <ul id="sortedList" className = "sorted-list" key={beer._id}>
                                                    <li className="list-item" onClick={() => handleBeerClick(beer)}> {beer.Name} </li>
                                                </ul>
                                            ))}
                                            <button className = "search-back-button" onClick = {handleSearchBackButton}><i className="bi bi-arrow-left"></i>Back</button>
                                        </>
                                    )) :
                        (<div>
                        <ul className = "sorted-list">
                            <li className="no-matches-message" > No beers matched with the criteria <br></br><i className="bi bi-emoji-frown"></i> </li>
                        </ul>
                        <button className = "search-back-button" onClick = {handleSearchBackButton}><i className="bi bi-arrow-left"></i>Back</button>
                        </div>)
            }



            </div>
            {validSearch && showDisplayBeer && selectedBeer && (
                <DisplayBeer beer={selectedBeer} />
            )}
        </div>
        <button onClick={switchComponents} className = "beer-list-button"><i className="bi bi-arrow-left"></i>Back</button>
    </div>
    );
}

export default BeerList;
