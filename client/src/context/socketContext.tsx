import { createContext } from "react";
import socketio, { Socket } from "socket.io-client";

export const chatSocket = socketio("http://10.11.7.11:3002/chat");
export const gameSocket = socketio("http://10.11.7.11:3003/game");

export const ChatContext = createContext<Socket>(chatSocket);
export const GameContext = createContext<Socket>(gameSocket);