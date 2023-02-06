import { Route, Routes } from "react-router";
import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/home/Home";
import MyProfile from "./pages/profil/myProfile/Component";
import Play from "./pages/play/Play";
import Games from "./pages/games/Games";
import Login from "./pages/login/Login";
import Auth from "./hooks/Auth";
import PageNotFound from "./pages/404/404";
import Profile from "./pages/profil/Profile";
import Redirect from "./pages/login/Redirect";
import User from "./hooks/User";
import AuthRoute from "./pages/login/AuthRoute";
import { getSavedItem } from "./utils/storage";
import { userType } from "./types/userType";
import Contact from "./components/contact/contact";
import "./styles/page.css";
import Chat from "./pages/chat/Chat";
import useLogginEvent from "./hooks/chatEvents/useLogginEvent";
import { notifType } from "./types/notifType";
import Notif from "./components/notifs/notifs";
import Stats from "./pages/stats/Stats";
import { ModalType } from "./types/modalType";
import { ModalContext } from "./context/modalContext";
import Modal from "./components/modal";
import useErrorEvent from "./hooks/chatEvents/useErrorEvents";
import DirectMessages from "./components/DmsBar/DirectMessages";
import GameComponent from "./pages/games/GameComponent";
import { CountdownContext, CountdownType } from "./context/countDownContext";
import useQueueEvents from "./hooks/gameEvents/useQueueEvents";
import Login2fa from "./pages/login/Login2fa";

export default function Router() {
  const [isLogged, setIsLogged] = React.useState(
    getSavedItem("isLogged") || false
  );
  const [user, setUser] = useState<userType>(getSavedItem("user"));
  const [notifs, setNotifs] = useState<notifType[]>([]);
  const [modal, setModal] = useState<ModalType | null>(null);
  const [countdown, setCountdown] = useState<CountdownType | null>(null);

  useLogginEvent({ user, setUser, setIsLogged, isLogged });
  useQueueEvents({ countdown, setCountdown });
  useErrorEvent();

  return (
    <Auth.Provider value={isLogged}>
      <User.Provider value={{ user, setUser }}>
        <ModalContext.Provider value={{ setModal }}>
          <CountdownContext.Provider value={{ countdown, setCountdown }}>
            <Navbar setIsLogged={setIsLogged} />
            {modal && <Modal header={modal.header} body={modal.body} />}
            <div className="main">
              <div className="w-[80%] ">
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route
                    path="/login/redirect"
                    element={
                      <Redirect setIsLogged={setIsLogged} setUser={setUser} />
                    }
                  />
                  <Route path="/login/2fa" element={<Login2fa />} />
                  <Route element={<AuthRoute />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/play" element={<Play />} />
                    <Route path="/games" element={<Games />} />
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/profile">
                      <Route index element={<MyProfile />} />
                      <Route path=":id" element={<Profile />} />
                      <Route path=":id/stats" element={<Stats />} />
                      <Route path="*" element={<PageNotFound />} />
                    </Route>
                    <Route path="*" element={<PageNotFound />} />
                  </Route>
                </Routes>
              </div>
              <div className="w-[20%]">{isLogged === true && <Contact />}</div>
            </div>
            {isLogged && <DirectMessages />}
          </CountdownContext.Provider>
        </ModalContext.Provider>
      </User.Provider>
    </Auth.Provider>
  );
}
