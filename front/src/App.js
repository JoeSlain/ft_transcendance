import './App.css';
import { useState } from 'react'
import UserPage from './pages/user'
import HomePage from './pages/home'
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";

function App() {
  return (
    <div id="main">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="homepage/" element={<HomePage />} />
        <Route path="/login" element={<UserPage />} />
      </Routes>
    </div>
  );
}

export default App;
