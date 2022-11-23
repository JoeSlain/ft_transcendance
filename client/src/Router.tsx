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
    useEffect(() => {
        axios(`http://localhost:3001/api/users`, {withCredentials: true})
        .then((res) =>
        {
          console.log("User found: " + res.data.username);
          setUser(res.data);
        })
        .catch((e) => {console.log("User not found " + e);});
      }, []);
    if (user.id === 0)
    {
        return (<></>);
    }
    else
    {
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
                        <Route path="profile" element={<ProfileNavbar/>}>   
                            <Route index element={<MyProfile {...user}/>}/>
                            <Route path="stats" element={<Stats />} />
                            <Route path="history" element={<History/>} />
                            <Route path=":id" element={<Profile {...user}/>}/>
                            <Route path="*" element={<PageNotFound />} />
                        </Route>
                        <Route path="*" element={<PageNotFound />} />
    
                    </Routes>
            </Auth.Provider>
        );
    }

}