import { createContext } from 'react'
import socketio from 'socket.io-client'
import { getStorageItem } from '../storage/localStorage';

export const socket = socketio('http://localhost:3002/chat')
export const SocketContext = createContext();