import "../styles/navbar.css";
import { NavLink, Navigate } from 'react-router-dom';
import axios from "axios";
import { useContext, useState } from 'react';
import { ChatContext } from "../context/socketContext";
import { saveStorageItem } from "../storage/localStorage";
import { UserContext } from "../context/userContext";

const Navbar = ({ setUser }) => {
    const socket = useContext(ChatContext)
    const user = useContext(UserContext)

    const handleLogout = () => {
        socket.emit('logout', {
            user: user,
            socketId: socket.id,
            status: 'offline'
          })
        axios
            .post('http://localhost:3001/api/auth/logout', {}, {
                withCredentials: true
            })
            .then(response => {
                console.log(response.data)
                setUser(null)
            })
        saveStorageItem('user', null)
    }

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
                        {user && <button onClick={handleLogout} > LogOut </button>}
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;