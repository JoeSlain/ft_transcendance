import './App.css';
import LoginPage from './pages/login'
import ProfilePage from './pages/profile'
import TwoFa from './pages/2fa'
import Params from './pages/params'
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
        <Route path="profile/:id" element={<ProfilePage user={user} setUser={setUser} />} />
        <Route path="login/2fa" element={<TwoFa />} />
        <Route path="profile/:id/params" element={<Params />} />
      </Routes>
    </div>
  );
}

export default App;
