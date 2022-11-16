import './App.css';
import LoginPage from './pages/login'
import ProfilePage from './pages/profile'
import TwoFa from './pages/2fa'
import Params from './pages/params'
import Navbar from './components/navbar'
import Play from './pages/play'
import Games from './pages/games'
import Chat from './pages/chat'
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
      <Navbar />
      <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="profile/:id" element={<ProfilePage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="login/2fa" element={<TwoFa />} />
          <Route path="params" element={<Params />} />
          <Route path="play" element={<Play />} />
          <Route path="games" element={<Games />} />
          <Route path="chat" element={<Chat />} />
      </Routes>
    </div>
  );
}

export default App;
