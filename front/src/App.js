import './App.css';
import './styles/pages.css'
//import './styles/notif.css'

import { SocketContext, socket } from './context/socketContext'
import ProtectedRoute from './components/protectedRoute'
import { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom";

import LoginPage from './pages/login'
import ProfilePage from './pages/profile'
import TwoFa from './pages/2fa'
import Params from './pages/params'
import Navbar from './components/navbar'
import Play from './pages/play'
import Games from './pages/games'
import Chat from './pages/chat'
import Friend from './pages/friend'
import Redirect from './pages/redirect'
import Notif from './components/notif';

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    const initialValue = JSON.parse(saved);
    return initialValue || null;
  })
  const [notif, setNotif] = useState(null)

  return (
    <div id="main">
      <SocketContext.Provider value={socket}>
        <Navbar user={user} setUser={setUser} />
        {notif && <Notif notif={notif} setNotif={setNotif} />}

        <div className='main'>
          <div className='main-content'>
            <Routes>
              <Route path="/" element={<LoginPage user={user} setUser={setUser} />} />
              <Route path="login" element={<LoginPage user={user} setUser={setUser} />} />
              <Route path="login/2fa" element={<TwoFa user={user} setUser={setUser} />} />
              <Route path="login/redirect" element={<Redirect user={user} setUser={setUser} />} />

              <Route element={<ProtectedRoute user={user} />} >
                <Route path="profile/:id" element={<ProfilePage user={user} setUser={setUser} />} />
                <Route path="profile" element={<ProfilePage user={user} setUser={setUser} />} />
                <Route path="params" element={<Params user={user} setUser={setUser} />} />
                <Route path="play" element={<Play user={user} setUser={setUser} />} />
                <Route path="games" element={<Games />} />
                <Route path="chat" element={<Chat />} />
              </Route>
            </Routes>
          </div>
          {
            user && <div className='aside'>
              <Friend me={user} setNotif={setNotif} />
            </div>
          }
        </div>
      </SocketContext.Provider>
    </div >
  );
}

export default App;
