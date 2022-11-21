import "../styles/navbar.css";
import { NavLink, Navigate } from 'react-router-dom';
import axios from "axios";
import { useContext, useState } from 'react';
import { SocketContext } from "../context/socketContext";

const Navbar = ({user, setUser}) => {
    //const user = JSON.parse(localStorage.getItem('user'));
    const socket = useContext(SocketContext)

    const handleLogout = () => {
        localStorage.setItem('user', null)
        socket.emit('updateStatus', {
            userId: user.id,
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
                        <button onClick={handleLogout} > LogOut </button>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;