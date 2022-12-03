import './App.css';
import './styles/pages.css'
import './styles/popup.tsx'
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
import { UserContext } from './context/userContext';

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
      if (!user) {
        setUser(data)
        saveStorageItem('user', data)
        navigate('/profile')
      }
    })

    return () => {
      chatSocket.off('connected')
      chatSocket.off('loggedIn')
    }
  }, [])

  return (
    <div id="main">
      <UserContext.Provider value={user}>
        <Navbar setUser={setUser} />
        {/*notif && <Notif notif={notif} setNotif={setNotif} />*/}
        {console.log('notifs', notifs)}
        {notifs[0] && <Notif notifs={notifs} setNotifs={setNotifs} />}

        <div className='main'>
          <div className='main-content'>
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="login/2fa" element={<TwoFa />} />
              <Route path="login/redirect" element={<Redirect />} />

              <Route element={<ProtectedRoute />} >
                <Route path="profile/:id" element={<ProfilePage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="params" element={<Params />} />
                <Route path="play" element={<Play />} />
                <Route path="games" element={<Games />} />
                <Route path="chat" element={<Chat />} />
              </Route>
            </Routes>
          </div>
          {
            user && <div className='aside'>
              <Friend setNotifs={setNotifs} />
            </div>
          }
        </div>
      </UserContext.Provider>
    </div >
  );
}

export default App;
