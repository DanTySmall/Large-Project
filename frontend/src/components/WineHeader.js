import React from 'react';
import logoImage from "../images/Paradise_Pours_Logo_Circle.png";
import '../main.css';
import { Link } from 'react-router-dom';


function WineHeader(){
    return(
        <div className="wine-header">
            <div>
                <a href="/homepage"><img src={logoImage} alt="Paradise Pours Logo" class="logo-img"></img></a>
            </div>
            <div class="menu">
            <Link to = "/homepage" className="wine-menu-button"><i class="bi bi-arrow-left"></i>Back</Link>
            </div>
        </div>
    );
}

export default WineHeader;
