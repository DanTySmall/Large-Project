import React from 'react';
import logoImage from "../images/Paradise_Pours_Logo_Circle.png";
import '../main.css';

function Header(){
    return(
        <div className="header">
            <a href="../../public/index.html"><img src={logoImage} alt="Paradise Pours Logo" class="logo-img"></img></a>
            <div class="menu">
                <div className="beer menu-button">Beer</div>
                <div className="wine menu-button">Wine</div>
                <div className="liquor menu-button">Liquor</div>
                <div className="menu menu-button">Menu</div>
            </div>
        </div>
    );
}

export default Header;