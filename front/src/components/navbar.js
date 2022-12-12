import "../styles/navbar.css";
import { NavLink, Navigate } from 'react-router-dom';
import axios from "axios";
import { useContext, useState } from 'react';
import { ChatContext } from "../context/socketContext";
import { saveStorageItem } from "../storage/localStorage";
import { UserContext } from "../context/userContext";
import logout from "./logout";

const Navbar = ({ setUser, setIsLogged }) => {
    const user = useContext(UserContext)
    const socket = useContext(ChatContext)

    return (
        <nav className="navigation">
            <div
                className="navigation-menu">
                <ul>
                    <li>
                        <NavLink className="navlink" to="/">Home</NavLink>
                    </li>
                    <li>
                        <NavLink className="navlink" to="/play">Play</NavLink>
                    </li>
                    <li>
                        <NavLink className="navlink" to="/games">Games</NavLink>
                    </li>
                    <li>
                        <NavLink className="navlink" to="/chat">Chat</NavLink>
                    </li>
                    <li>
                        <NavLink className="navlink" to="/profile">Profile</NavLink>
                    </li>
                    <li>
                        {user && <button onClick={() => socket.emit('logout', user)} > LogOut </button>}
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;