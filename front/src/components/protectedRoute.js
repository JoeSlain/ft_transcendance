import { Outlet, Navigate } from "react-router-dom"
import { useEffect, useState, useContext } from 'react'
import socketio from "socket.io-client";
import axios from 'axios'

import { SocketContext } from '../context/socketContext'
import { UserContext } from "../context/userContext";

const ProtectedRoute = ({
    redirectPath = '/login',
    children,
}) => {
    const url = 'http://localhost:3002/chat'
    const user = useContext(UserContext)

    if (!user) {
        return <Navigate to={redirectPath} replace />
    }
    return children ? children : <Outlet />//<Outlet context={[socket, setSocket]}/>
}

export default ProtectedRoute;