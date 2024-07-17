import React from 'react';
import '../main.css';
import GitHubIcon from '../images/github-icon.png';


function WineFooter(){

    async function GitHubLinkOnClickHandler(event){
        event.preventDefault();

        const url = event.currentTarget.getAttribute('href');

        window.open(url, '_blank');
    }

    return(
        <div className = "wine-footer">
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
        </div>
    )
}

export default WineFooter;