import { Injectable } from "@nestjs/common";
import { PaddleType, Room } from "src/utils/types";
import { GameType } from "../utils/types";
import { InjectRepository } from "@nestjs/typeorm";
import { Game, User } from "src/database";
import { Repository } from "typeorm";
import { RoomService } from "./room.service";
import { BallType } from "src/utils/types";
import { PlayerType } from "src/utils/types";
import { posix } from "path";

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game) private gameRepo: Repository<Game>,
    @InjectRepository(User) private userRepo: Repository<User>,
    private readonly roomService: RoomService
  ) {}

  users: Map<number, GameType> = new Map();
  games = new Map<string, GameType>();
  //gameInfos = new Array<GameInfos>();

  newPlayer(width: number, height: number, id: number) {
    const player = {
      x: id === 1 ? 30 : width - 50,
      y: height / 2 - 30,
      width: 20,
      height: 60,
      score: 0,
      win: false,
      paddle: null,
      infos: null,
    };
    player.paddle = {
      left: player.x,
      right: player.x + player.width,
      top: player.y + player.height,
      bottom: player.y,
      up: false,
      down: false,
    };
    return player;
  }

  newBall(width: number, height: number, dir: number) {
    const ball = {
      x: width / 2 - 5,
      y: height / 2 - 5,
      speedX: dir * 5,
      speedY: (Math.random() * 2 - 1) * 5,
      radius: 10,
      //xVel: vel,
    };
    return ball;
  }

  createGame(room: Room): GameType {
    const width = 800; // largeur de la zone de jeu
    const height = 600; // hauteur de la zone de jeu
    const gameId = room.id;

    const player1 = this.newPlayer(width, height, 1);
    player1.infos = room.host.infos;
    const player2 = this.newPlayer(width, height, 2);
    player2.infos = room.guest.infos;

    const ball = this.newBall(width, height, 1);
    const game: GameType = {
      width,
      height,
      player1,
      player2,
      ball,
      gameRunning: true,
      scoreUpdate: false,
      gameId,
      powerUps: true,
      grid: new Array(70),
    };
    for (var i = 0; i < 70; i++) {
      game.grid[i] = new Array(50);
    }

    for (var i = 0; i < 70; i++) {
      for (var j = 0; j < 50; j++) {
        game.grid[i][j] = -1;
      }
    }

    this.saveGame(game);
    //this.pushGameInfos(game, room);
    return game;
  }

  resetGame(game: GameType) {
    const user1 = game.player1.infos;
    const user2 = game.player2.infos;

    game.ball = this.newBall(game.width, game.height, 1);
    game.player1 = this.newPlayer(game.width, game.height, 1);
    game.player1.infos = user1;
    game.player2 = this.newPlayer(game.width, game.height, 2);
    game.player1.infos = user2;
    game.gameRunning = true;
    this.saveGame(game);

    return game;
  }

  player1Collision(game: GameType) {
    if (
      game.ball.x <= game.player1.x + game.player1.width &&
      game.ball.x > game.player1.x &&
      game.ball.y >= game.player1.y &&
      game.ball.y <= game.player1.y + game.player1.height
    )
      return true;
    return false;
  }

  player2Collision(game: GameType) {
    if (
      game.ball.x + 10 >= game.player2.x &&
      game.ball.x < game.player2.x + game.player2.width &&
      game.ball.y > game.player2.y &&
      game.ball.y < game.player2.y + game.player2.height
    )
      return true;
    return false;
  }

  /*accelerate(x, y, dx, dy, accel, dt) {
    var x2 = x + dt * dx + accel * dt * dt * 0.5;
    var y2 = y + dt * dy + accel * dt * dt * 0.5;
    var dx2 = dx + accel * dt * (dx > 0 ? 1 : -1);
    var dy2 = dy + accel * dt * (dy > 0 ? 1 : -1);

    return { x: x2, y: y2, dx: dx2, dy: dy2 };
  }*/

  setPaddleUp(paddle: PaddleType) {
    paddle.up = true;
    paddle.down = false;
    return paddle;
  }

  setPaddleDown(paddle: PaddleType) {
    paddle.up = false;
    paddle.down = true;
    return paddle;
  }

  movePaddle(game: GameType, playerId: number, direction: string) {
    if (playerId === 1) {
      if (direction === "ArrowUp") {
        if (game.player1.y > 0) {
          game.player1.y -= 10;
          game.player1.paddle = this.setPaddleUp(game.player1.paddle);
        }
      } else if (direction === "ArrowDown") {
        if (game.player1.y + game.player1.height < game.height) {
          game.player1.y += 10;
          game.player1.paddle = this.setPaddleDown(game.player1.paddle);
        }
      }
    } else if (playerId === 2) {
      if (direction === "ArrowUp") {
        if (game.player2.y > 0) {
          game.player2.y -= 10;
          game.player2.paddle = this.setPaddleUp(game.player2.paddle);
        }
      } else if (direction === "ArrowDown") {
        if (game.player2.y + game.player2.height < game.height) {
          game.player2.y += 10;
          game.player2.paddle = this.setPaddleDown(game.player2.paddle);
        }
      }
    }
    this.saveGame(game);
    return game;
  }

  // Fonction pour mettre à jour la position d'une balle
  updateBall(game: GameType, dt: number) {
    // Mettre à jour la position de la balle en fonction de sa vitesse
    game.ball.x += game.ball.speedX;
    game.ball.y += game.ball.speedY;

    // Vérifier la collision avec les limites du canvas
    if (game.ball.y < 0) {
      game.ball.speedY *= -1;
      game.ball.y = 0;
    } else if (game.ball.y + 10 > game.height) {
      game.ball.speedY *= -1;
      game.ball.y = game.height - game.ball.radius;
    }

    if (this.player1Collision(game)) {
      game.ball.speedX *= -1;
      game.ball.x += game.player1.width;
      if (
        (game.ball.speedY < 0 &&
          game.ball.y > game.player1.y + game.player1.height / 2) ||
        (game.ball.speedY > 0 &&
          game.ball.y < game.player1.y + game.player1.height / 2)
      )
        game.ball.speedY *= -1;
    } else if (this.player2Collision(game)) {
      game.ball.speedX *= -1;
      game.ball.x -= game.player2.width;
      if (
        (game.ball.speedY < 0 &&
          game.ball.y > game.player2.y + game.player2.height / 2) ||
        (game.ball.speedY > 0 &&
          game.ball.y < game.player2.y + game.player2.height / 2)
      )
        game.ball.speedY *= -1;
    } else {
      if (game.ball.x <= 0) {
        game.player2.score++;
        game.ball = this.newBall(game.width, game.height, -1);
        game.scoreUpdate = true;
      } else if (game.ball.x >= game.width) {
        game.player1.score++;
        game.ball = this.newBall(game.width, game.height, 1);
        game.scoreUpdate = true;
      }
    }

    this.saveGame(game);
    return game;
  }

  spawnPowerUp(game: GameType) {
    if (game.powerUps) {
      if (Math.random() >= 0.995) {
        const x = Math.floor(Math.random() * 70);
        const y = Math.floor(Math.random() * 50);
        if (
          game.grid[x][y] >= 0 ||
          (x > game.width / 2 - 10 && x < game.width / 2 + 25)
        ) {
          return game;
        }
        game.grid[x][y] = Math.floor(Math.random() * 2);
      }
    }
    this.saveGame(game);
    return game;
  }

  startGame(game: GameType) {
    game.gameRunning = true;
  }

  stopGame(game: GameType) {
    game.gameRunning = false;
  }

  getGameForUser(id: number) {
    return this.users.get(id);
  }

  getCurrentGames() {
    const games = [];
    const iter = this.games.values();

    while (iter) {
      const current = iter.next().value;
      if (!current) return games;
      games.push({
        id: current.gameId,
        player1: current.player1.infos,
        player2: current.player2.infos,
        score: `${current.player1.score}/${current.player2.score}`,
      });
    }

    return games;
  }

  saveGame(game: GameType) {
    this.games.set(game.gameId, game);
    this.users.set(game.player1.infos.id, game);
    this.users.set(game.player2.infos.id, game);
  }

  deleteGame(game: GameType): void {
    this.games.delete(game.gameId);
    this.users.delete(game.player1.infos.id);
    this.users.delete(game.player2.infos.id);
  }

  async register(game: GameType) {
    const newGame = this.gameRepo.create({
      user1: game.player1.infos,
      user2: game.player2.infos,
      winnerId: game.player1.win
        ? game.player1.infos.id
        : game.player2.infos.id,
      score1: game.player1.score,
      score2: game.player2.score,
      date: new Date().toISOString().slice(0, 10),
    });

    return await this.gameRepo.save(newGame);
  }

  async updateUsersElo(gameInfos: Game) {
    let winner, loser;

    // set winner/loser
    if (gameInfos.user1.id === gameInfos.winnerId) {
      winner = gameInfos.user1;
      loser = gameInfos.user2;
    } else {
      winner = gameInfos.user2;
      loser = gameInfos.user1;
    }
    // update stats
    if (winner.elo > loser.elo) {
      winner.elo += 1;
      loser.elo -= 1;
    } else if (winner.elo === loser.elo) {
      winner.elo += 10;
      loser.elo -= 10;
    } else {
      winner.elo += 20;
      loser.elo -= 20;
    }
    winner.n_win++;
    loser.n_lose++;
    // save stats
    winner = await this.userRepo.save(winner);
    loser = await this.userRepo.save(loser);
    return { winner, loser };
  }

  async updateRoom(room: Room, gameInfos: Game) {
    const { winner, loser } = await this.updateUsersElo(gameInfos);

    if (winner.id === room.host.infos.id) {
      room.host.infos = winner;
      room.guest.infos = loser;
    } else {
      room.host.infos = loser;
      room.guest.infos = winner;
    }
    room.gameStarted = false;
    room.host.ready = false;
    room.guest.ready = false;
    this.roomService.updateRoom(room.id, room);

    return room;
  }
}
