import { Route, Routes } from "react-router";
import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/home/Home";
import MyProfile from "./pages/profil/MyProfile";
import History from './pages/profil/History';
import Stats from "./pages/stats/Stats"
import Play from "./pages/play/Play";
import Games from "./pages/games/Games";
import ProfileNavbar from "./pages/profil/Navbar";
import Login from "./pages/login/Login";
import { VerifLogged } from "./pages/login/Login";
import Auth from "./hooks/Auth";
import { AuthRoute } from "./pages/login/AuthRoute";
import PageNotFound from "./pages/404/404";
import axios from "axios";
import { userType } from "./types/userType";
import Profile from "./pages/profil/Profile";
import { Navigate } from "react-router-dom";
import Redirect from "./pages/login/Redirect";
import User from "./hooks/User";

export default function Router() {
    const [isLogged, setIsLogged] = React.useState(VerifLogged);
    const [user, setUser] = useState<userType>({
        id: 0,
        username: "",
        email: "",
        twoFactorAuthenticationSecret: "",
        isTwoFactorAuthenticationEnabled: false,
        id42: 0,
        winratio: "",
        profile_pic: "",
        elo: 0,
        n_win: 0,
        n_lose: 0,
        date_of_sign: new Date()
    });

    {
        return (
            <Auth.Provider value={{ isLogged }}>
                <User.Provider value={{user}}>
                    <AuthRoute />
                    <Navbar />
                    <Routes>
                        <Route path="/" element={isLogged ? <Home /> : <Navigate to='/login' />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/login/redirect" element={<Redirect setIsLogged={setIsLogged} setUser={setUser} />} />
                        <Route path="/home" element={isLogged ? <Home /> : <Navigate to='/login' />} />
                        <Route path="/play" element={isLogged ? <Play /> : <Navigate to='/login' />} />
                        <Route path="/games" element={isLogged ? <Games /> : <Navigate to='/login' />} />
                        <Route path="/profile" element={isLogged ? <ProfileNavbar /> : <Navigate to='/login' />}>
                            <Route index element={isLogged ? <MyProfile /> : <Navigate to='/login' />} />
                            <Route path="stats" element={isLogged ? <Stats /> : <Navigate to='/login' />} />
                            <Route path="history" element={isLogged ? <History /> : <Navigate to='/login' />} />
                            <Route path=":id" element={isLogged ? <Profile /> : <Navigate to='/login' />} />
                            <Route path="*" element={isLogged ? <PageNotFound /> : <Navigate to='/login' />} />
                        </Route>
                        <Route path="*" element={<PageNotFound />} />
                    </Routes>
                </User.Provider>
            </Auth.Provider>
        );
    }

}