import { string } from "joi";
import { Channel } from "src/database";
import { User } from "src/database/entities/User";

// I. CHAT

// done type for serializer
export type Done = (err: Error, user: User) => void;

// user details for db query
export type UserDetails = {
  username: string;
  email: string;
  id42: number;
  img_url: string;
};

// notif data
export type NotifData = {
  type: string;
  from: User;
  to: User;
  acceptEvent: string;
  channel?: Channel;
};

// channel data
export type ChannelData = {
  name: string;
  type: string;
  password?: string;
  owner: User;
};

// message data
export type MessageData = {
  content: string;
  from?: User;
  channel: any;
};

// II. GAME

// 1. ROOM
// room user
export type RoomUser = {
  infos: User;
  ready: boolean;
};

// room
export type Room = {
  id: string;
  host: RoomUser;
  guest: RoomUser;
  spectators: Array<User>;
  gameStarted: boolean;
};

// 2. GAME
// pong game
export type GameInfos = {
  id: string;
  player1: User;
  player2: User;
  score: string;
};

export type PowerUp = {
  x: number;
  y: number;
  type: number;
  size: number;
};

export type GameType = {
  width: number;
  height: number;
  player1: PlayerType;
  player2: PlayerType;
  ball: BallType;
  gameRunning: boolean;
  scoreUpdate: boolean;
  powerUps: boolean;
  grid: PowerUp[];
  gameId: any;
};

// pong player
export type PlayerType = {
  x: number;
  y: number;
  width: number;
  height: number;
  score: number;
  win: boolean;
  paddle: PaddleType;
  infos: User;
};

// pong ball
export type BallType = {
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  radius: number;
  //xVel: number;
};

// paddle
export type PaddleType = {
  top: number;
  bottom: number;
  left: number;
  right: number;
  up: boolean;
  down: boolean;
};
