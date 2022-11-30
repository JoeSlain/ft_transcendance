import './App.css';
import './styles/pages.css'
//import './styles/notif.css'

import { ChatContext, GameContext } from './context/socketContext'
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
import axios from 'axios';

function App() {
  const [user, setUser] = useState(getStorageItem('user'))
  const [notif, setNotif] = useState(null)
  const [notifs, setNotifs] = useState([])
  const navigate = useNavigate()
  const chatSocket = useContext(ChatContext)
  const gameSocket = useContext(GameContext)

  useEffect(() => {
    chatSocket.on('connected', () => {
      if (user) {
        chatSocket.emit('login', {
          user: user,
          socketId: chatSocket.id,
          status: 'online'
        })
      }
    })

    chatSocket.on('loggedIn', data => {
      console.log('loggedIn')
      axios
        .get('http://localhost:3001/api/users/notifs', {
          withCredentials: true
        })
        .then(response => {
          setNotifs(response.data)
          console.log('notif', response.data)
        })
      setUser(data)
      saveStorageItem('user', data)
      navigate('/profile')
    })

    return () => {
      chatSocket.off('connected')
      chatSocket.off('loggedIn')
    }
  }, [])

  return (
    <div id="main">
      <Navbar user={user} setUser={setUser} />
      {/*notif && <Notif notif={notif} setNotif={setNotif} />*/}
      {console.log('notifs', notifs)}
      {notifs[0] && <Notif notifs={notifs} setNotifs={setNotifs} />}

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
            <Friend me={user} setNotifs={setNotifs} />
          </div>
        }
      </div>
    </div >
  );
}

export default App;
