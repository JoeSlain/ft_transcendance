import './App.css';
import './styles/pages.css'
import LoginPage from './pages/login'
import ProfilePage from './pages/profile'
import TwoFa from './pages/2fa'
import Params from './pages/params'
import Navbar from './components/navbar'
import Play from './pages/play'
import Games from './pages/games'
import Chat from './pages/chat'
import Friend from './pages/friend'

import { io } from 'socket.io-client'
import { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";

const CHAT_GW = 'http://localhost:3002/chat'

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    const initialValue = JSON.parse(saved);
    return initialValue || {};
  })

  useEffect(() => {
    const socket = io(CHAT_GW)

    socket.emit('update_status', user)
    socket.on('new_client', data => {
      console.log(`client ${data.id} connected successfully`)
    })

    return () => socket.disconnect()
  }, [])

  return (
    <div id="main">
      <Navbar />

      <div className='main'>
        <div className='main-content'>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="profile/:id" element={<ProfilePage user={user} setUser={setUser} />} />
            <Route path="profile" element={<ProfilePage user={user} setUser={setUser} />} />
            <Route path="login/2fa" element={<TwoFa />} />
            <Route path="params" element={<Params />} />
            <Route path="play" element={<Play />} />
            <Route path="games" element={<Games />} />
            <Route path="chat" element={<Chat />} />
          </Routes>
        </div>
        <div className='aside'>
          <Friend />
        </div>
      </div>
    </div>
  );
}

export default App;
