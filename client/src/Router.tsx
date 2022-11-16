import { Route, Routes } from "react-router";
import Layout from "./components/layout";
import Navbar from "./components/Navbar";
import Home from "./pages/home/Home";
import Profil from "./pages/profil/Profil";
import History from './pages/profil/History';
import Stats from "./pages/stats/Stats"
import Play from "./pages/play/Play";
import Games from "./pages/games/Games";
//import NavbarProfil from "./pages/profil/Navbar";
import Login from "./pages/login/Login";


export default function Router()
{
    return (
        <>
        <Navbar />
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Login />} />
                <Route path="/home" element={<Home />} />
                <Route path="/play" element={<Play />} />
                <Route path="/games" element={<Games />} />
            </Route>
            <Route>
                <Route path="/profil" element={<Profil id="1"/>} />
                <Route path="/history" element={<History />} />
                <Route path="/stats" element={<Stats />} />
            </Route>
        </Routes>
        </>
    );

}