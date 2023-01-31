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
  x: number;
  y: number;
  width: number;
  height: number;
  xVel: number;
  yVel: number;
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
  xVel: number;
};

export type gameData = {
  width: number;
  height: number;
  player1: PlayerType;
  player2: PlayerType;
  ball: BallType;
  gameRunning: boolean;
  grid: Array<Array<number>>;
  gameId: any;
};
