import LiquorHeader from "../components/LiquorHeader";
import React, { } from 'react';
import LiquorList from "../components/LiquorList";
import '../css/LiquorPage.css';
import '../main.css';


function LiquorPage(){
    return(
        <div className ="liq-page">
            <div className = "liq-content">
                <LiquorHeader />
                <LiquorList />
            </div>
        </div>
    );
}

export default LiquorPage;