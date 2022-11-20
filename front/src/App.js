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
import ProtectedRoute from './components/protectedRoute'

import { io } from 'socket.io-client'
import { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom";

const CHAT_GW = 'http://localhost:3002/chat'

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    const initialValue = JSON.parse(saved);
    return initialValue || null;
  })

  /*useEffect(() => {
    const socket = io(CHAT_GW)

    socket.emit('update_status', user)
    socket.on('new_client', data => {
      console.log(`client ${data.id} connected successfully`)
    })

    return () => socket.disconnect()
  }, [])*/

  return (
    <div id="main">
      <Navbar user={user} setUser={setUser} />

      <div className='main'>
        <div className='main-content'>
          <Routes>
            <Route path="/" element={<LoginPage user={user} setUser={setUser} />} />
            <Route path="login" element={<LoginPage user={user} setUser={setUser} />} />
            <Route path="login/2fa" element={<TwoFa user={user} setUser={setUser}/>} />

            <Route element={<ProtectedRoute user={user} />} >
              <Route path="profile/:id" element={<ProfilePage user={user} setUser={setUser} />} />
              <Route path="profile" element={<ProfilePage user={user} setUser={setUser} />} />
              <Route path="params" element={<Params />} />
              <Route path="play" element={<Play />} />
              <Route path="games" element={<Games />} />
              <Route path="chat" element={<Chat />} />
            </Route>
          </Routes>
        </div>
        {
          user && <div className='aside'> <Friend /> </div>
        }
      </div>
    </div >
  );
}

export default App;
