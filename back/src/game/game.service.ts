import { Injectable } from "@nestjs/common";
import { Room } from "src/utils/types";
import { RoomService } from "./room.service";
import { Socket, Namespace } from "socket.io";
@Injectable()
export class GameService {
  constructor(private readonly roomService: RoomService) {}

  users: Map<number, string> = new Map();
  games = new Map<number, GameType>()
  

  createGame(gameData: { width: number; height: number }): GameType {
    const game: GameType = {
      id: Date.now(), // utiliser l'horodatage actuel comme identifiant unique de la partie
      players: [],
      ball: {
        x: 0,
        y: 0,
        speedX: 0,
        speedY: 0,
        xVel: 1

      },
      running: false,
      height: gameData.height || 500,
      width: gameData.width || 800
    };
    this.addBall(game);
    this.saveGame(game);
    return game;
  }

  addPlayer(game: GameType, playerId: string, client: Socket): void {
    const PADDLE_HEIGHT: number = 60
    const PADDLE_WIDTH: number = 20
    const newPlayer: PlayerType = {
      id: playerId,
      score: 0,
      paddle: {
        x: 0,
        y: 0,
        width: PADDLE_WIDTH, 
        height: PADDLE_HEIGHT,
        xVel : 1,
        yVel : 0,
      },
    };
    game.players.push(newPlayer);
  }
  addBall(game: GameType): void {
    const INITIAL_SPEED: number = 3
    game.ball = {
      x: 0,
      y: 0,
      speedX: INITIAL_SPEED, 
      speedY: INITIAL_SPEED, 
      xVel : 1,
    };
  }
  saveGame(game: GameType): void {
    this.games.set(game.id, game);
  }

  startGame(game: GameType) {
    game.running = true;
  }

  stopGame(game: GameType) {
    game.running = false;
  }

  deleteGame(gameId: number): void {
    this.games.delete(gameId);
  }
 

movePaddle(game: GameType, playerId: string, direction: string, speed: number): PaddleType {
  // Trouve le joueur à qui appartient la raquette
  const player = game.players.find((p) => p.id === playerId);
  if (!player) return player.paddle; // Retourne la position actuelle de la raquette si le joueur est introuvable

  // Crée un nouvel objet de type 'PaddleType' à partir de l'objet actuel
  const newPaddle = {...player.paddle};

  // Met à jour la coordonnée y de la raquette en fonction de la direction et de la vitesse
  if (direction === 'up') newPaddle.y -= speed;
  else if (direction === 'down') newPaddle.y += speed;

  // S'assure que la raquette reste dans les limites de l'aire de jeu
  if (newPaddle.y < 0) newPaddle.y = 0;
  if (newPaddle.y + newPaddle.height > game.height) newPaddle.y = game.height - newPaddle.height;

  return newPaddle;
}


moveBall(game: GameType): GameType {
  const ball = game.ball;

  // mettre à jour la position de la balle en fonction de sa vitesse
  ball.x += ball.speedX;
  ball.y += ball.speedY;

  // si la balle touche un bord, changer sa direction (inverser sa vitesse)
  if (ball.y + ball.speedY < 0 || ball.y + ball.speedY > game.height)
    ball.speedY = -ball.speedY;
  if (ball.x + ball.speedX < 0 || ball.x + ball.speedX > game.width)
    ball.speedX = -ball.speedX;

  return game;
}

}

export interface GameType {
  id: number; // un identifiant unique pour chaque partie
  players: PlayerType[]; // un tableau contenant les joueurs de la partie
  ball: BallType; // les coordonnées et la vitesse de la balle dans la partie
  running: boolean; // indique si la partie est en cours ou non
  height: number;
  width: number;
}

export interface PlayerType {
  id: string; // un identifiant unique pour chaque joueur
  score: number; // le score du joueur
  paddle: PaddleType; // les coordonnées et les dimensions de la raquette du joueur
}

export interface BallType {
  x: number; // la coordonnée x de la balle
  y: number; // la coordonnée y de la balle
  speedX: number; // la vitesse de la balle en x
  speedY: number; // la vitesse de la balle en y
  xVel: number; // la vitesse de la raquette en x
}

export interface PaddleType {
  x: number; // la coordonnée x de la raquette
  y: number; // la coordonnée y de la raquette
  width: number; // la largeur de la raquette
  height: number; // la hauteur de la raquette
  xVel: number; // la vitesse de la raquette en x
  yVel: number; // la vitesse de la raquette en y
}