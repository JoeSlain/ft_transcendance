import { Route, Routes } from "react-router";
import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/home/Home";
import MyProfile from "./pages/profil/myProfile/Component";
import Stats from "./pages/stats/Stats";
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
import Notifs from "./components/notifs/notifs";
import { ModalType } from "./types/modalType";
import Modal from "./components/modal";
import { ModalContext } from "./context/modalContext";

export default function Router() {
  const [isLogged, setIsLogged] = useState(getSavedItem("isLogged"));
  const [user, setUser] = useState<userType>(getSavedItem("user"));
  const [modal, setModal] = useState<ModalType | null>(null);

  useLogginEvent({ user, isLogged, setUser, setIsLogged });

  return (
    <Auth.Provider value={isLogged}>
      <User.Provider value={{ user, setUser }}>
        <ModalContext.Provider value={{ setModal }}>
          <div className="header">
            {isLogged && <Notifs />}
            <Navbar setIsLogged={setIsLogged} />
          </div>
          <div className="main">
            {modal && (
              <Modal
                header={modal.header}
                body={modal.body}
                acceptEvent={modal.acceptEvent}
                data={modal.data}
              />
            )}
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/login/redirect"
                element={
                  <Redirect setIsLogged={setIsLogged} setUser={setUser} />
                }
              />
              <Route element={<AuthRoute />}>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/play" element={<Play />} />
                <Route path="/games" element={<Games />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/profile">
                  <Route index element={<MyProfile />} />
                  <Route path=":id" element={<Profile />} />
                  {/*               <Route path="stats" element={<Stats />} />
                   */}{" "}
                  <Route path="*" element={<PageNotFound />} />
                </Route>
                <Route path="*" element={<PageNotFound />} />
              </Route>
            </Routes>
            <Contact />
          </div>
        </ModalContext.Provider>
      </User.Provider>
    </Auth.Provider>
  );
}
