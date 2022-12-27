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
import { useQuery } from "@tanstack/react-query";
import { userType } from "./types/userType";

export default function Router() {
  const [isLogged, setIsLogged] = React.useState(
    getSavedItem("isLogged") || false
  );
  const [user, setUser] = useState<userType>(getSavedItem("user"));

  console.log("islogged", isLogged);

  return (
    <Auth.Provider value={isLogged}>
      <User.Provider value={{user, setUser}}>
        <Navbar userKey={"isLogged"} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/login/redirect"
            element={<Redirect setIsLogged={setIsLogged} setUser={setUser} />}
          />
          <Route element={<AuthRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/play" element={<Play />} />
            <Route path="/games" element={<Games />} />
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
      </User.Provider>
    </Auth.Provider>
  );
}
