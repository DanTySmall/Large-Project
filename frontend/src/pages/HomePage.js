import React from 'react';
import '../main.css';
import Header from '../components/Header.js';
import AboutUs from '../components/AboutUs.js';
import Footer from '../components/HomeFooter.js';

const HomePage = () => {
  return (
    <div className = "page">
      <div className="home-page">
        <div className="content" >
          <Header />
          <AboutUs />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
