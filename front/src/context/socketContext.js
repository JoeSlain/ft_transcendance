import socketio from "socket.io-client";
import {createContext} from 'react'

export const socket = socketio('http://localhost:3002/chat');
export const SocketContext = createContext();