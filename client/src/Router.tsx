import { Route, Routes } from "react-router";
import React, { useEffect } from "react";
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

export default function Router() {
    const [isLogged, setIsLogged] = React.useState(VerifLogged);

    useEffect(() => {
        axios(`http://localhost:3001/api/users`, {withCredentials: true})
        .then((res) =>
        {
          console.log("User found: " + res.data.profile_pic);
          setUser(res.data);
        })
        .catch((e) => {console.log("User not found " + e);});
      }, []);
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
{/*                 <Route element={<ProfileNavbar/>}>
*/}                     <Route path="/profile" element={<MyProfile />}>
                            <Route path=":id" element={<MyProfile />}/>
                        </Route>
                        <Route path="/stats" element={<Stats />} />
                        <Route path="/history" element={<History/>} />
{/*                             </Route>
*/}                 <Route path="*" element={<PageNotFound />} />

                </Routes>
        </Auth.Provider>
    );

}

function setUser(data: any) {
    throw new Error("Function not implemented.");
}
