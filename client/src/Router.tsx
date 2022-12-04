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
import VerifLogged from "./pages/login/VerifLogged";
import Auth from "./hooks/Auth";
import PageNotFound from "./pages/404/404";
import axios from "axios";
import { userType } from "./types/userType";
import Profile from "./pages/profil/Profile";
import { Navigate } from "react-router-dom";
import Redirect from "./pages/login/Redirect";
import User from "./hooks/User";
import AuthRoute from "./pages/login/AuthRoute";
import {getSavedItem} from "./utils/storage";

export default function Router() {
    const [isLogged, setIsLogged] = React.useState(getSavedItem('isLogged') || false);
    const [user, setUser] = useState(getSavedItem('user'));

    console.log('islogged', isLogged)
    {
        return (
            <Auth.Provider value={isLogged}>
                <User.Provider value={user}>
                    <Navbar />
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/login/redirect" element={<Redirect setIsLogged={setIsLogged} setUser={setUser} />} />
                        <Route element={<AuthRoute />} >
                            <Route path="/" element={<Home />} />
                            <Route path="/home" element={<Home /> } />
                            <Route path="/play" element={<Play />} />
                            <Route path="/games" element={<Games />} />
                            <Route path="/profile" element={ <ProfileNavbar /> }>
                                <Route index element={ <MyProfile /> } />
                                <Route path="stats" element={ <Stats /> } />
                                <Route path="history" element={ <History /> } />
                                <Route path=":id" element={ <Profile /> } />
                                <Route path="*" element={ <PageNotFound /> } />
                            </Route>
                        </Route>
                        <Route path="*" element={<PageNotFound />} />
                    </Routes>
                </User.Provider>
            </Auth.Provider>
        );
    }

}