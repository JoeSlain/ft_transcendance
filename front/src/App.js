import './App.css';
import { useState } from 'react'
import LoginPage from './pages/login'
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
        <Route path="/" element={<LoginPage />} />
        <Route path="homepage/" element={<LoginPage />} />
        <Route path="/login" element={<HomePage />} />
      </Routes>
    </div>
  );
}

export default App;
