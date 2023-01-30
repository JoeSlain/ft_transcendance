import { Injectable } from "@nestjs/common";
import { Room } from "src/utils/types";
import { GameType } from "../utils/types";
import { InjectRepository } from "@nestjs/typeorm";
import { Game, User } from "src/database";
import { Repository } from "typeorm";
import { RoomService } from "./room.service";

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
      paddle: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        xVel: 0,
        yVel: 0,
      },
      infos: null,
    };
    return player;
  }

  newBall(width: number, height: number, vel: number) {
    const ball = {
      x: width / 2 - 5,
      y: height / 2 - 5,
      speedX: 10,
      speedY: 5,
      xVel: vel,
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
    const game = {
      width,
      height,
      player1,
      player2,
      ball,
      gameRunning: true,
      scoreUpdate: false,
      gameId,
    };

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

  // Fonction pour mettre à jour la position d'une balle
  updateBall(game: GameType) {
    // Mettre à jour la position de la balle en fonction de sa vitesse
    game.ball.x += game.ball.speedX * game.ball.xVel;
    game.ball.y += game.ball.speedY;

    // Vérifier la collision avec les limites du canvas
    if (game.ball.y < 0 || game.ball.y + 10 > game.height)
      game.ball.speedY *= -1;

    // Vérifier la collision avec les paddles
    if (
      (game.ball.x < game.player1.x + game.player1.width &&
        game.ball.y > game.player1.y &&
        game.ball.y < game.player1.y + game.player1.height) ||
      (game.ball.x + 10 > game.player2.x &&
        game.ball.y > game.player2.y &&
        game.ball.y < game.player2.y + game.player2.height)
    ) {
      game.ball.speedX *= -1;
    }
    if (game.ball.x <= 0) {
      game.player2.score++;
      game.ball = this.newBall(game.width, game.height, -1);
      game.scoreUpdate = true;
    } else if (game.ball.x >= game.width) {
      game.player1.score++;
      game.ball = this.newBall(game.width, game.height, 1);
      game.scoreUpdate = true;
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

  movePaddle(game: GameType, playerId: number, direction: string) {
    if (playerId === 1) {
      if (direction === "ArrowUp") {
        if (game.player1.y > 0) game.player1.y -= 20;
      } else if (direction === "ArrowDown") {
        if (game.player1.y + game.player1.height < game.height)
          game.player1.y += 20;
      }
    } else if (playerId === 2) {
      if (direction === "ArrowUp") {
        if (game.player2.y > 0) game.player2.y -= 20;
      } else if (direction === "ArrowDown") {
        if (game.player2.y + game.player2.height < game.height)
          game.player2.y += 20;
      }
    }
    this.saveGame(game);
    return game;
  }

  async register(game: GameType) {
    console.log("registering game", game);
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
