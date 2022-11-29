import './App.css';
import './styles/pages.css'
//import './styles/notif.css'

import { SocketContext } from './context/socketContext'
import ProtectedRoute from './components/protectedRoute'
import { useState, useEffect, useContext } from 'react'
import {
  Route,
  Routes,
  useNavigate,
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
import { getStorageItem, saveStorageItem } from './storage/localStorage';

function App() {
  const [user, setUser] = useState(getStorageItem('user'))
  const [notif, setNotif] = useState(null)
  const navigate = useNavigate()
  const socket = useContext(SocketContext)

  useEffect(() => {
    socket.on('connected', () => {
      if (user) {
        console.log('emiting login')
        socket.emit('login', {
          user: user,
          socketId: socket.id,
          status: 'online'
        })
        console.log('emit new client')
        console.log(user)
      }
      console.log('on connected')
      console.log('socket id', socket.id)
    })

    socket.on('loggedIn', data => {
      console.log('loggedIn')
      setUser(data)
      saveStorageItem('user', data)
      navigate('/profile')
    })

    return () => {
      socket.off('connected')
      socket.off('loggedIn')
    }
  }, [])

  return (
    <div id="main">
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
    </div >
  );
}

export default App;
