import React from 'react';
import '../main.css';
import GitHubIcon from '../images/github-icon.png';


function LiqFooter(){

    async function GitHubLinkOnClickHandler(event){
        event.preventDefault();

        const url = event.currentTarget.getAttribute('href');

        window.open(url, '_blank');
    }

    return(
        <div className = "liq-footer">
            <div className = "github-logo-container">
                <a onClick = {GitHubLinkOnClickHandler} href = "https://github.com/DanTySmall/Large-Project">
                    <img src = {GitHubIcon} className = "github-logo"></img>
                </a>
            </div>
            <div className = "footer-text">
                <p>
                    <i class="bi bi-arrow-left-square"></i> Follow this link to view our GitHub
                </p>
            </div>
            <div className = "disclaimer-container">
                <p>
                    *DISCLAIMER: Paradise Pours does not assume responsibility for any incorrect alcohol nutrition information*
                </p>
            </div>
        </div>
    )
}

export default LiqFooter;