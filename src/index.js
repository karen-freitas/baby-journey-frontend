import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { UserDataProvider } from './context/UserDataContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UserDataProvider>
      <App />
    </UserDataProvider>
  </React.StrictMode>
);
