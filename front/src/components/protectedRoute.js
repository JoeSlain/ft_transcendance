import { Outlet, Navigate } from "react-router-dom"
import { useEffect, useState, useContext } from 'react'
import socketio from "socket.io-client";
import axios from 'axios'

import { SocketContext } from '../context/socketContext'

const ProtectedRoute = ({
    user,
    redirectPath = '/login',
    children,
}) => {
    const url = 'http://localhost:3002/chat'

    if (!user) {
        return <Navigate to={redirectPath} replace />
    }
    return children ? children : <Outlet />//<Outlet context={[socket, setSocket]}/>
}

export default ProtectedRoute;