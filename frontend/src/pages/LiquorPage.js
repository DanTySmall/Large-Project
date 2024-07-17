import LiquorHeader from "../components/LiquorHeader";
import React, { } from 'react';
import LiquorList from "../components/LiquorList";
import '../css/LiquorPage.css';
import '../main.css';
import Footer from '../components/LiqFooter.js';

function LiquorPage(){
    return(
        <div className = "page">
            <div className ="liq-page">
                <div className = "liq-content">
                    <LiquorHeader />
                    <LiquorList />
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default LiquorPage;