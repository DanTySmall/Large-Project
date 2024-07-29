import React from 'react';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage.js';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BeerPage from './pages/BeerPage.js';
import LiquorPage from './pages/LiquorPage.js';
import WinePage from './pages/WinePage.js';
import AboutUsPage from './pages/AboutUsPage.js'
import VerifyEmailPage from './pages/VerifyEmailPage.js';
import ChangePasswordPage from './pages/ChangePasswordPage.js';
import ForgotPassPage from './pages/ForgotPassPage.js';
import SettingsPage from './pages/SettingsPage.js';
import { UserProvider } from './components/userProvider';

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/beer" element={<BeerPage />} />
          <Route path="/wine" element={<WinePage />} />
          <Route path="/liquor" element={<LiquorPage />} />
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/about+us" element={<AboutUsPage />} />
          <Route path="/verify/:uniqueString" element={<VerifyEmailPage />} />
          <Route path="/changePassword/:uniqueString" element={<ChangePasswordPage />} />
          <Route path="/forgotPass" element={<ForgotPassPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
