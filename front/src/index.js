import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { socket, SocketContext } from './context/socketContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <SocketContext.Provider value={socket}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </SocketContext.Provider>
);