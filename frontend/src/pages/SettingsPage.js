import React from 'react';
import '../main.css';
import SettingsHeader from '../components/SettingsHeader.js';
import Footer from '../components/HomeFooter.js';

const SettingsPage = () => {
  return (
    <div className = "page">
      <div className="home-page">
        <div className="content" >
          <SettingsHeader />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default SettingsPage;
