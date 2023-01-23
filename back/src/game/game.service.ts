import { Injectable } from "@nestjs/common";
import { Room } from "src/utils/types";
import { RoomService } from "./room.service";
import { Socket, Namespace } from "socket.io";
import { GameType, } from "../utils/types";
import { Game } from "src/database";
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class GameService {
  constructor(private readonly roomService: RoomService) {}

  users: Map<number, string> = new Map();
  games = new Map<number, GameType>()

  // addUsersFromRoom(room: Room) {
  //   console.log('addUsersFromRoom', room);
  //   this.users.set(room.host.infos.id, room.host.infos.username);
  //   if (room.guest) this.users.set(room.guest.infos.id, room.guest.infos.username);
  // }

  // removeUserFromRoom(userId: number) {
  //   this.users.delete(userId);
  // }

  startGameLoop(game: GameType, clients: Socket, room: Room) {
    this.startGame(game);
    // Création d'une boucle de jeu
    const gameLoop = setInterval(() => {
      // Mise à jour de l'état du jeu
      this.updateGame(game, clients);

      // Vérification de la fin de la partie
      if (game.player1.score >= 10) {
        clearInterval(gameLoop);
        game.player1.win = true;
        clients.emit('win', { game, room: room.id });
        this.stopGame(game);
        return;
      }
      if (game.player2.score >= 10) {
        clearInterval(gameLoop);
        game.player2.win = true;
        clients.emit('win', { game, room: room.id });
        this.stopGame(game);

        return;
      }
      console.log('gameLoop', game);

      // Envoi des mises à jour de l'état du jeu aux clients connectés à la salle

      this.users.forEach(users => {
        clients.emit('updateGameState', { game, room: room.id });
        console.log('updateGameState', { game, room: room.id });
      });
    }, 1000 / 60);
  }

  private updateGame(game: GameType, clients: Socket) {
    this.updatePaddle(game, clients);
    this.updatePaddle(game, clients);
    this.updateBall(game);
    // console.log('updateGame');
  }
  
  createGame(room: Room): GameType {
    const width = 800; // largeur de la zone de jeu
    const height = 600; // hauteur de la zone de jeu
    const gameId = this.generateRandomId;
    const player1 = {
      x: 30,
      y: height / 2 - 30,
      width: 20,
      height: 60,
      score: 0,
      win: false,
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
      win: false,
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

  
    console.log('createGame', room);
    return { width, height, player1, player2, ball, room, gameRunning: false, gameId };
  }

  generateRandomId() {
    return uuidv4();
  }
  // Fonction pour mettre à jour la position d'un paddle
  private updatePaddle(game: GameType, clients: Socket) {
    // clients.on("movePaddle", (data) => {
    //   const { direction} = data;
     
    //     if (direction === "ArrowUp") {
    //       if (game.player1.y > 0) game.player1.y -= 10;
    //     } else if (direction === "ArrowDown") {
    //       if (game.player1.y + game.player1.height < game.height) game.player1.y += 10;
    
    //    } 
      //  else if () {
      //   if (direction === "ArrowUp") {
      //     if (game.player2.y > 0) game.player2.y -= 10;
      //   } else if (direction === "ArrowDown") {
      //     if (game.player2.y + game.player2.height < game.height) game.player2.y += 10;
      //   }
      // }
    // });
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
    game.gameRunning = true;
  }

  stopGame(game: GameType) {
    game.gameRunning = false;
  }

  deleteGame(gameId: number): void {
    this.games.delete(gameId);
  }

  movePaddle(client: Socket, data: any) {
    // const { direction, player} = data;
    // const game = this.games.get(..);
    // if (!game) {
    //   console.error("Unable to find game for client");
    //   return;
    // }
    // if (player === 1) {
    //   if (direction === "ArrowUp") {
    //     if (game.player1.y > 0) game.player1.y -= 10;
    //   } else if (direction === "ArrowDown") {
    //     if (game.player1.y + game.player1.height < game.height) game.player1.y += 10;
    //   }
    // } else if (player === 2) {
    //   if (direction === "ArrowUp") {
    //     if (game.player2.y > 0) game.player2.y -= 10;
    //   } else if (direction === "ArrowDown") {
    //     if (game.player2.y + game.player2.height < game.height) game.player2.y += 10;
    //   }
    // }
    // // Envoyer les mises à jour de l'état du jeu aux clients connectés à la salle
    // client.emit("updateGameState", { game });
  }

}