// styles
import "./App.css";
import "./styles/pages.css";
import "./styles/popup.tsx";

// react
import ProtectedRoute from "./components/protectedRoute";
import { useState, useEffect, useContext } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import axios from "axios";

// components
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
import Alert from './components/alert';

import { getStorageItem, saveStorageItem } from './storage/localStorage';
import { UserContext } from './context/userContext';
import { ChatContext, GameContext } from './context/socketContext'
import logout from './components/logout';

function App() {
  const [user, setUser] = useState(getStorageItem('user'))
  const [notifs, setNotifs] = useState([])
  const [isLogged, setIsLogged] = useState(false)
  const [room, setRoom] = useState(getStorageItem('room'))
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const chatSocket = useContext(ChatContext)
  const gameSocket = useContext(GameContext)

  useEffect(() => {
    chatSocket.on("connect", () => {
      if (user) chatSocket.emit("login", user);
    });

    chatSocket.on("disconnect", () => {
      //logout(user, chatSocket, setUser, setIsLogged)
      chatSocket.emit("logout", user);
    });

    chatSocket.on('loggedIn', data => {
      console.log('loggedIn')
      axios
        .get("http://localhost:3001/api/users/notifs", {
          withCredentials: true,
        })
        .then((response) => {
          setNotifs(response.data);
          if (!user) {
            console.log("user null");
            setUser(data);
            saveStorageItem("user", data);
            setIsLogged(true);
            navigate("/profile");
          }
          console.log("user", data);
          setIsLogged(true);
        });
    });

    chatSocket.on('error', data => {
      alert(data);
    })

    gameSocket.on('connect', () => {
      if (room)
        gameSocket.emit('join', room.id)
    })

    gameSocket.on('clearRoom', () => {
      console.log('me left')
      setRoom(null)
      saveStorageItem('room', null)
    })

    gameSocket.on('error', data => {
      alert(data)
    })

    return () => {
      chatSocket.off('connect')
      chatSocket.off('disconnect')
      chatSocket.off('loggedIn')
      chatSocket.off('clearRoom')
      chatSocket.off('error')
      gameSocket.off('error')
    }
  }, [error])

  useEffect(() => {
    chatSocket.on('loggedOut', () => {
      axios
        .post('http://localhost:3001/api/auth/logout', {}, {
          withCredentials: true
        })
        .then(() => {
          if (room) {
            const data = {
              userId: user.id,
              roomId: room.id,
            }
            gameSocket.emit('leaveRoom', data)
          }
          setUser(null)
          setIsLogged(false)
          saveStorageItem('user', null)
        })
    })

    gameSocket.on('joinedRoom', data => {
      if (!room) {
        console.log('room created')
        //gameSocket.emit('join', data.id)
      }
      else if (room.id !== data.id) {
        const data = {
          userId: user.id,
          roomId: room.id,
        }
        gameSocket.emit('leaveRoom', data)
        /*gameSocket.emit('join', data.id, () => {
          console.log('joined socket ok')
        })*/
      }
      setRoom(data);
      saveStorageItem('room', data)
      console.log('data room', data)
      console.log('joined room socket')
    })

    gameSocket.on('leftRoom', (data) => {
      console.log('leftroom')

      console.log('someone left')
      setRoom(data.room)
      saveStorageItem('room', data.room)
    })

    return () => {
      chatSocket.off('loggedOut')
      gameSocket.off('joinedRoom')
      gameSocket.off('leftRoom')
    }
  }, [user, room])

  return (
    <div id="main">
      <UserContext.Provider value={user}>
        <Navbar setUser={setUser} setIsLogged={setIsLogged} />
        {isLogged && notifs[0] && (
          <Notif notifs={notifs} setNotifs={setNotifs} />
        )}

        <div className="main">
          <div className="main-content">
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="login/2fa" element={<TwoFa />} />
              <Route path="login/redirect" element={<Redirect />} />

              <Route element={<ProtectedRoute />}>
                <Route path="profile/:id" element={<ProfilePage />} />
                <Route path="profile" element={<ProfilePage setUser={setUser} />} />
                <Route path="params" element={<Params setUser={setUser} />} />
                <Route path="play" element={<Play room={room} setRoom={setRoom} />} />
                <Route path="games" element={<Games />} />
                <Route path="chat" element={<Chat />} />
              </Route>
            </Routes>
          </div>
          {isLogged && user && (
            <div className="aside">
              <Friend setNotifs={setNotifs} />
            </div>
          )}
        </div>
      </UserContext.Provider>
    </div>
  );
}

export default App;
