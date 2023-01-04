import { createContext } from "react";
import socketio, { Socket } from "socket.io-client";

export const chatSocket = socketio("http://localhost:3002/chat");
export const gameSocket = socketio("http://localhost:3003/game");

export const ChatContext = createContext<Socket>(chatSocket);
export const GameContext = createContext<Socket>(gameSocket);
