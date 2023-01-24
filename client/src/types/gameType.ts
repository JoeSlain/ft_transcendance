export type gameType = {
  userId1: number;
  userId2: number;
  winnerId: number;
  score: string;
  status: string;
  date: Date;
  gameId: number;
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
  gameId: any;
};
