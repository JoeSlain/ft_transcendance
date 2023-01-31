import { userType } from "./userType";

export type GameInfos = {
  id: string;
  user1: userType;
  user2: userType;
  score: string;
};

export type gameType = {
  user1?: userType;
  user2?: userType;
  winnerId: number;
  score1: number;
  score2: number;
  date: Date;
};

export type PaddleType = {
  top: number;
  bottom: number;
  left: number;
  right: number;
  up: boolean;
  down: boolean;
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
  id: number;
};

// pong ball
export type BallType = {
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  radius: number;
};

export type PowerUp = {
  x: number;
  y: number;
  type: number;
  size: number;
};

export type gameData = {
  width: number;
  height: number;
  player1: PlayerType;
  player2: PlayerType;
  ball: BallType;
  gameRunning: boolean;
  grid: PowerUp[];
  gameId: any;
};
