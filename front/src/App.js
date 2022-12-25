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
import LoginPage from "./pages/login";
import ProfilePage from "./pages/profile";
import TwoFa from "./pages/2fa";
import Params from "./pages/params";
import Navbar from "./components/navbar";
import Play from "./pages/play";
import Games from "./pages/games";
import Chat from "./pages/chat";
import Friend from "./pages/friend";
import Redirect from "./pages/redirect";
import Notif from "./components/notif";
import Alert from "./components/alert";

import { getStorageItem, saveStorageItem } from "./storage/localStorage";
import { UserContext } from "./context/userContext";
import { ChatContext, GameContext } from "./context/socketContext";
import logout from "./components/logout";
import AddChannel from "./components/chat/addChannel";

function App() {
  const [user, setUser] = useState(getStorageItem("user"));
  const [notifs, setNotifs] = useState([]);
  const [showChanMenu, setShowChanMenu] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [room, setRoom] = useState(getStorageItem("room"));
  const [error, setError] = useState(null);
  const [chat, setChat] = useState({
    directMessages: [],
    publicChans: [],
    privateChans: [],
  });
  /*const [chat, setChat] = useState({
    directMessages: [
      {
        name: "test1",
        type: "directMessages",
        messages: [
          {
            from: "test1",
            content: "wassup dude",
          },
          {
            from: "dchheang",
            content: "hey wassup",
          },
          {
            from: "test1",
            content: "wanna do some",
          },
          {
            from: "test1",
            content: "blitzsociety tomorrow ?",
          },
          {
            from: "dchheang",
            content: "i'm down, let's meet up after work",
          },
          {
            from: "test1",
            content: "sounds good, what time u get off ?",
          },
          {
            from: "dchheang",
            content: "should be off by 8 tops",
          },
        ],
      },
      {
        name: "test2",
        type: "directMessages",
        messages: [],
      },
    ],
    privateChans: [
      {
        name: "chan1",
        type: "private",
        users: [
          { username: "test1" },
          { username: "test2" },
          { username: "dchheang" },
        ],
        messages: [
          {
            from: "test1",
            content:
              "hey guys i was wondering if u were free \
            tomorrow afternoon for some winetasting. Nicole found a \
            great place on Marvin street, with a great selection to \
            discover.",
          },
          {
            from: "dchheang",
            content:
              "i'm down, i get off work at 7pm, text me the adress beforehand !",
          },
          {
            from: "test2",
            content: "wassup guys",
          },
        ],
      },
      {
        name: "chan2",
        type: "private",
        users: [{ username: "test1" }],
      },
    ],
    publicChans: [
      {
        name: "chan1",
        type: "public",
        users: [{ username: "test2" }],
      },
    ],
  });*/

  const navigate = useNavigate();
  const chatSocket = useContext(ChatContext);
  const gameSocket = useContext(GameContext);

  // login events
  useEffect(() => {
    chatSocket.on("connect", () => {
      if (user) chatSocket.emit("login", user);
    });

    chatSocket.on("disconnect", () => {
      //logout(user, chatSocket, setUser, setIsLogged)
      if (user) chatSocket.emit("logout", user);
    });

    chatSocket.on("loggedIn", (data) => {
      console.log("loggedIn");
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

    chatSocket.on("error", (data) => {
      alert(data);
    });

    gameSocket.on("clearRoom", () => {
      console.log("me left");
      setRoom(null);
      saveStorageItem("room", null);
    });

    gameSocket.on("error", (data) => {
      alert(data);
    });

    return () => {
      chatSocket.off("connect");
      chatSocket.off("disconnect");
      chatSocket.off("loggedIn");
      chatSocket.off("error");

      gameSocket.off("connect");
      gameSocket.off("clearRoom");
      gameSocket.off("error");
    };
  }, [user]);

  // logout and room events
  useEffect(() => {
    chatSocket.on("loggedOut", () => {
      axios
        .post(
          "http://localhost:3001/api/auth/logout",
          {},
          {
            withCredentials: true,
          }
        )
        .then(() => {
          if (room) {
            const data = {
              userId: user.id,
              roomId: room.id,
            };
            gameSocket.emit("leaveRoom", data);
          }
          setUser(null);
          setIsLogged(false);
          saveStorageItem("user", null);
        });
    });

    gameSocket.on("connect", () => {
      if (room) gameSocket.emit("join", room.id);
    });

    gameSocket.on("joinedRoom", (data) => {
      if (!room) {
        console.log("room created");
        //gameSocket.emit('join', data.id)
      } else if (room.id !== data.id) {
        const data = {
          userId: user.id,
          roomId: room.id,
        };
        gameSocket.emit("leaveRoom", data);
        /*gameSocket.emit('join', data.id, () => {
          console.log('joined socket ok')
        })*/
      }
      setRoom(data);
      saveStorageItem("room", data);
      console.log("data room", data);
      console.log("joined room socket");
    });

    gameSocket.on("leftRoom", (data) => {
      console.log("leftroom");

      console.log("someone left");
      setRoom(data.room);
      saveStorageItem("room", data.room);
    });

    return () => {
      chatSocket.off("loggedOut");
      gameSocket.off("joinedRoom");
      gameSocket.off("leftRoom");
    };
  }, [user, room]);

  return (
    <div id="main">
      <UserContext.Provider value={user}>
        <Navbar setUser={setUser} setIsLogged={setIsLogged} />
        {isLogged && notifs[0] && (
          <Notif notifs={notifs} setNotifs={setNotifs} />
        )}
        {showChanMenu && <AddChannel setShowChanMenu={setShowChanMenu} />}

        <div className="main">
          <div className="main-content">
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="login/2fa" element={<TwoFa />} />
              <Route path="login/redirect" element={<Redirect />} />

              <Route element={<ProtectedRoute />}>
                <Route path="profile/:id" element={<ProfilePage />} />
                <Route
                  path="profile"
                  element={<ProfilePage setUser={setUser} />}
                />
                <Route path="params" element={<Params setUser={setUser} />} />
                <Route
                  path="play"
                  element={<Play room={room} setRoom={setRoom} />}
                />
                <Route path="games" element={<Games />} />
                <Route
                  path="chat"
                  element={
                    <Chat
                      chat={chat}
                      setChat={setChat}
                      setShowChanMenu={setShowChanMenu}
                    />
                  }
                />
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
