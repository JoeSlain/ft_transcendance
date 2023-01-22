
// Type pour la référence du canvas
export type CanvasRef = React.RefObject<HTMLCanvasElement>;

// Type pour les données de mise à jour de l'état de jeu
export type GameUpdateData = {
  game: GameType;
  roomId: string;
};

// Type pour les données de jeu
export type GameType = {
  width: number;
  height: number;
  player1: PlayerType;
  player2: PlayerType;
  ball: BallType;
};

// Type pour les données d'un joueur
export type PlayerType = {
  x: number;
  y: number;
  width: number;
  height: number;
  score: number;
  paddle: PaddleType;
};

// Type pour les données de la balle
export type BallType = {
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  xVel: number;
};

// Type pour les données du paddle
export type PaddleType = {
	x: number;
	y: number;
	width: number;
	height: number;
	xVel: number;
	yVel: number;
  };
  