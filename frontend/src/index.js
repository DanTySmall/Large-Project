import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { UserProvider } from './components/userProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <UserProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </UserProvider> 
);