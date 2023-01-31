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

  intercept(x1, y1, x2, y2, x3, y3, x4, y4, d) {
    var denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
    if (denom != 0) {
      var ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
      if (ua >= 0 && ua <= 1) {
        var ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;
        if (ub >= 0 && ub <= 1) {
          var x = x1 + ua * (x2 - x1);
          var y = y1 + ua * (y2 - y1);
          return { x, y, d };
        }
      }
    }
    return null;
  }

  // check model
  ballIntercept(ball: BallType, paddle: PaddleType, nx, ny) {
    var pt;

    if (nx < 0) {
      pt = this.intercept(
        ball.x,
        ball.y,
        ball.x + nx,
        ball.y + ny,
        paddle.right,
        paddle.top,
        paddle.right,
        paddle.bottom + ball.radius,
        "right"
      );
    } else if (nx > 0) {
      pt = this.intercept(
        ball.x,
        ball.y,
        ball.x + nx,
        ball.y + ny,
        paddle.left - ball.radius,
        paddle.top,
        paddle.left - ball.radius,
        paddle.bottom + ball.radius,
        "left"
      );
    }
    if (!pt) {
      if (ny < 0) {
        pt = this.intercept(
          ball.x,
          ball.y,
          ball.x + nx,
          ball.y + ny,
          paddle.left - ball.radius,
          paddle.bottom + ball.radius,
          paddle.right,
          paddle.bottom + ball.radius,
          "bottom"
        );
      } else if (ny > 0) {
        pt = this.intercept(
          ball.x,
          ball.y,
          ball.x + nx,
          ball.y + ny,
          paddle.left - ball.radius,
          paddle.top,
          paddle.right,
          paddle.top,
          "top"
        );
      }
    }
    return pt;
  }

  accelerate(x, y, dx, dy, radius) {
    const x2 = x + dx;
    const y2 = y + dy;
    return {
      nx: x2 - x,
      ny: y2 - y,
      x: x2,
      y: y2,
      dx,
      dy,
      radius,
    };
  }

  updateBall(game: GameType) {
    const pos = this.accelerate(
      game.ball.x,
      game.ball.y,
      game.ball.speedX,
      game.ball.speedY,
      game.ball.radius
    );
    //pos.x += pos.speedX;
    //pos.y += pos.speedY;

    if (pos.dy > 0 && pos.y + pos.radius > game.height) {
      pos.y = game.height - pos.radius;
      pos.dy *= -1;
    } else if (pos.dy < 0 && pos.y < 0) {
      pos.y = 0;
      pos.dy *= -1;
    }
    const paddle = pos.dx < 0 ? game.player1.paddle : game.player2.paddle;
    const pt = this.ballIntercept(game.ball, paddle, pos.nx, pos.ny);
    if (pt) {
      if (pt.d === "left" || pt.d === "right") {
        pos.x = pt.x;
        pos.dx *= -1;
      } else if (pt.d === "top" || pt.d === "bottom") {
        pos.y = pt.y;
        pos.dy *= -1;
      }
    }
    if (pos.x <= 0) {
      game.player2.score++;
      game.ball = this.newBall(game.width, game.height, -1);
      game.scoreUpdate = true;
    } else if (game.ball.x + game.ball.radius >= game.width) {
      game.player1.score++;
      game.ball = this.newBall(game.width, game.height, 1);
      game.scoreUpdate = true;
    } else
      game.ball = {
        ...game.ball,
        x: pos.x,
        y: pos.y,
        speedX: pos.dx,
        speedY: pos.dy,
      };
    /*if (paddle.up) ball.speedY *= ball.speedY < 0 ? 0.5 : 1.5;
    else if (paddle.down) ball.speedY *= ball.speedY > 0 ? 0.5 : 1.5;
    */
    this.saveGame(game);
    return game;
  }

  updatePaddle(player: PlayerType) {
    player.paddle = {
      ...player.paddle,
      top: player.y + player.height,
      bottom: player.y,
      up: false,
      down: false,
    };
    return player.paddle;
  }

  movePaddle(game: GameType, playerId: number, direction: string) {
    if (playerId === 1) {
      if (direction === "ArrowUp") {
        if (game.player1.y > 0) {
          game.player1.y -= 10;
          game.player1.paddle = this.updatePaddle(game.player1);
        }
      } else if (direction === "ArrowDown") {
        if (game.player1.y + game.player1.height < game.height) {
          game.player1.y += 10;
          game.player1.paddle = this.updatePaddle(game.player1);
        }
      }
    } else if (playerId === 2) {
      if (direction === "ArrowUp") {
        if (game.player2.y > 0) {
          game.player2.y -= 10;
          game.player2.paddle = this.updatePaddle(game.player2);
        }
      } else if (direction === "ArrowDown") {
        if (game.player2.y + game.player2.height < game.height) {
          game.player2.y += 10;
          game.player2.paddle = this.updatePaddle(game.player2);
        }
      }
    }
    this.saveGame(game);
    return game;
  }

  // Fonction pour mettre à jour la position d'une balle
  /*updateBall(game: GameType) {
    // Mettre à jour la position de la balle en fonction de sa vitesse
    game.ball.x += game.ball.speedX;
    game.ball.y += game.ball.speedY;

    // Vérifier la collision avec les limites du canvas
    if (game.ball.y < 0 || game.ball.y + 10 > game.height)
      game.ball.speedY *= -1;

    if (this.player1Collision(game)) {
      game.ball.speedX *= -1;
      if (
        (game.ball.speedY < 0 &&
          game.ball.y > game.player1.y + game.player1.height / 2) ||
        (game.ball.speedY > 0 &&
          game.ball.y < game.player1.y + game.player1.height / 2)
      )
        game.ball.speedY *= -1;
    } else if (this.player2Collision(game)) {
      game.ball.speedX *= -1;
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
  }*/

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
