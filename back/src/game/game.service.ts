import { Injectable } from "@nestjs/common";
import { Room } from "src/utils/types";
import { RoomService } from "./room.service";
import { Socket, Namespace } from "socket.io";
import { GameType, PlayerType, BallType, PaddleType } from "../utils/types";
@Injectable()
export class GameService {
  constructor(
    private readonly roomService: RoomService
  ) { }

  users: Map<number, string> = new Map();
  games = new Map<number, GameType>()

  startGameLoop(game: GameType, clients, roomId: string) {
    const gameLoop = setInterval(() => {
      // Mise à jour de l'état du jeu
      this.updateGame(game);

      // Envoi des mises à jour de l'état du jeu aux clients connectés à la salle
      clients.forEach(client => {
        client.emit('updateGameState', { game, roomId });
      });
    }, 1000 / 60);
  }

  private updateGame(game: GameType) {
    this.updatePaddle(game, game.player1.x, game.player1.y);
    this.updatePaddle(game, game.player2.x, game.player2.y);
    this.updateBall(game);
  }

  createGame(room: Room): GameType {
    const width = 800; // largeur de la zone de jeu
    const height = 600; // hauteur de la zone de jeu
    const player1 = {
      x: 30,
      y: height / 2 - 30,
      width: 20,
      height: 60,
      score: 0,
      paddle: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        xVel: 0,
        yVel: 0,
      },
    };
    const player2 = {
      x: width - 50,
      y: height / 2 - 30,
      width: 20,
      height: 60,
      score: 0,
      paddle: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        xVel: 0,
        yVel: 0,
      },
    };
    const ball = {
      x: width / 2 - 5,
      y: height / 2 - 5,
      speedX: 10,
      speedY: 5,
      xVel: 1,
    };
    return { width, height, player1, player2, ball };
  }

  // Fonction pour mettre à jour la position d'un paddle
  updatePaddle(game: GameType, playerId: number, y: number) {
    const player = playerId === 1 ? game.player1 : game.player2;

    // Vérifier que le paddle ne sort pas des limites du canvas
    if (y < 0) y = 0;
    if (y + player.height > game.height) y = game.height - player.height;

    player.y = y;
  }

  // Fonction pour mettre à jour la position d'une balle
  updateBall(game: GameType) {
    const ball = game.ball;
    // Mettre à jour la position de la balle en fonction de sa vitesse
    ball.x += ball.speedX * ball.xVel;
    ball.y += ball.speedY;

    // Vérifier la collision avec les limites du canvas
    if (ball.y < 0 || ball.y + 10 > game.height) ball.speedY *= -1;

    // Vérifier la collision avec les paddles
    if (
      (ball.x < game.player1.x + game.player1.width &&
        ball.y > game.player1.y &&
        ball.y < game.player1.y + game.player1.height) ||
      (ball.x + 10 > game.player2.x &&
        ball.y > game.player2.y &&
        ball.y < game.player2.y + game.player2.height)
    ) {
      ball.speedX *= -1;
    }
    if (game.ball.x <= 0) {
      game.player2.score++;
      this.resetBall(game);
    } else if (game.ball.x >= game.width) {
      game.player1.score++;
      this.resetBall(game);
    }
  }
  saveGame(game: GameType): void {
    // this.games.set(game.id, game);
  }
  resetBall(game: GameType): GameType {
    // Réinitialisation de la position de la balle au centre du canvas
    game.ball.x = game.width / 2 - 5;
    game.ball.y = game.height / 2 - 5;
    
    // Réinitialisation de la vitesse de la balle
    game.ball.speedX = 10;
    game.ball.speedY = 5;

    // Sélection aléatoire de la direction initiale de la balle
    if (Math.random() > 0.5) {
      game.ball.xVel = 1;
    } else {
      game.ball.xVel = -1;
    }
    return game;
  }

  startGame(game: GameType) {
    // game.running = true;
  }

  stopGame(game: GameType) {
    // game.running = false;
  }

  deleteGame(gameId: number): void {
    this.games.delete(gameId);
  }


}