import { Route, Routes } from "react-router";
import React from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/home/Home";
import Profil from "./pages/profil/Profil";
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

export default function Router() {
    const [isLogged, setIsLogged] = React.useState(VerifLogged);
    return (
        <Auth.Provider value={{ isLogged }}>
           <AuthRoute/>
                <Navbar /> 
                <Routes>
                            <Route path="/" element={<Home />}/>
                            <Route path="/login" element={<Login />} />
                            <Route path="/home" element={<Home />} />
                            <Route path="/play" element={<Play />} />
                            <Route path="/games" element={<Games />} />
                            <Route element={<ProfileNavbar/>}>
                                <Route path="/profile">
                                    <Route path=":id" element={<Profil />}/> 
                                </Route>
                                <Route path="/stats" element={<Stats />} />
                                <Route path="/history" element={<History/>} /> 
                            </Route>
                            <Route path="*" element={<PageNotFound />} />

                </Routes>
        </Auth.Provider>
    );

}