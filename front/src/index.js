import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import {
  chatSocket,
  gameSocket,
  ChatContext,
  GameContext,
} from './context/socketContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ChatContext.Provider value={chatSocket}>
    <GameContext.Provider value={gameSocket}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GameContext.Provider>
  </ChatContext.Provider>
);