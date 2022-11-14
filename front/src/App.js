import './App.css';
import LoginPage from './pages/login'
import HomePage from './pages/home'
import { useState } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";

function App() {
  const [user, setUser] = useState({});

  return (
    <div id="main">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="profile/:id" element={<HomePage user={user} setUser={setUser} />} />
      </Routes>
    </div>
  );
}

export default App;
