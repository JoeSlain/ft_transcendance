import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Socket, Namespace } from "socket.io";
import { User } from "src/database";
import { GameType, Room } from "src/utils/types";
import { GameService } from "./game.service";
import { RoomService } from "./room.service";
import { QueueService } from "./queue.service";

@WebSocketGateway(3003, {
  cors: {
    origin: "http://10.11.7.11:3000",
  },
  namespace: "game",
})
export class GameGateway {
  constructor(
    private readonly roomService: RoomService,
    private readonly gameService: GameService,
    private readonly queueService: QueueService
  ) {}

  @WebSocketServer() server: Namespace;

  @SubscribeMessage("login")
  login(client: Socket, user: User) {
    this.getRoom(client, user);
  }

  @SubscribeMessage("logout")
  logout(client: Socket, user: User) {
    let room = this.roomService.getUserRoom(user.id);

    if (room && !room.gameStarted) {
      const roomLeft = this.roomService.leaveRoom(room.id, user.id);
      client.to(room.id).emit("leftRoom", roomLeft);
      client.leave(room.id);
    }
    this.queueService.stopQueue(user.id);
  }

  // ROOM

  @SubscribeMessage("getRoom")
  getRoom(client: Socket, user: User) {
    let room = this.roomService.getUserRoom(user.id);

    if (!room) {
      room = this.roomService.createRoom(user);
      this.roomService.usersRooms.set(user.id, room);
    }
    client.join(room.id);
    this.server.to(client.id).emit("newRoom", room);
  }

  @SubscribeMessage("joinRoom")
  joinRoom(client: Socket, data: any) {
    console.log("join event");
    let room = this.roomService.getUserRoom(data.id);

    // check room
    if (!room) {
      this.server.to(client.id).emit("error", "game room not found");
      return null;
    }
    // leave previous room
    const prevRoom = this.roomService.getUserRoom(data.user.id);
    if (prevRoom) {
      if (prevRoom.id !== room.id && !prevRoom.gameStarted)
        this.leaveRoom(client, { roomId: prevRoom.id, user: data.user });
      else return;
    }
    // add user to room
    room = this.roomService.joinRoom(data.user, room);
    this.roomService.usersRooms.set(data.user.id, room);
    client.join(room.id);
    this.server.to(room.id).emit("joinedRoom", room);
  }

  @SubscribeMessage("join")
  join(client: Socket, roomId: string) {
    client.join(roomId);
  }

  @SubscribeMessage("leaveRoom")
  leaveRoom(client: Socket, data: any) {
    console.log("leave room event");
    const room = this.roomService.leaveRoom(data.roomId, data.user.id);

    console.log(`client ${data.user.id} left room ${data.roomId}`);
    client.to(data.roomId).emit("leftRoom", room);
    client.leave(data.roomId);
    this.getRoom(client, data.user);
  }

  @SubscribeMessage("spectate")
  spectate(client: Socket, data: any) {
    console.log("spectatate event");
    let room = this.roomService.usersRooms.get(data.user.id);

    // check room
    if (!room) {
      this.server
        .to(client.id)
        .emit("error", ` ${data.user.username} is not currently in a game`);
      return;
    }
    // leave previous room
    const prevRoom = this.roomService.getUserRoom(data.me.id);
    if (prevRoom) {
      if (
        this.gameService.getGameForUser(data.me.id) ||
        prevRoom.id === room.id
      )
        return;
      this.leaveRoom(client, { roomId: prevRoom.id, user: data.me });
    }
    // add spectator to room
    room = this.roomService.addSpectator(data.me, room);
    this.roomService.rooms.set(room.id, room);
    this.roomService.usersRooms.set(data.me.id, room);
    client.join(room.id);
    this.server.to(room.id).emit("joinedRoom", room);
  }

  @SubscribeMessage("setReady")
  setReady(client: Socket, data: any) {
    console.log("setReady event");
    data.room = this.roomService.setReady(data.roomId, data.userId);
    this.server.to(data.roomId).emit("ready", data.room);
  }

  /*@SubscribeMessage("eloUpdated")
  updateRoom(client: Socket, user: User) {
    const room = this.roomService.getUserRoom(user.id);

    if (!room) return;
    if (room.host.infos.id === user.id) room.host.infos = user;
    else if (room.guest.infos.id === user.id) room.guest.infos = user;
    this.roomService.updateRoom(room.id, room);

    this.server.to(room.id).emit("updateRoom", room);
  }*/

  // GAME

  @SubscribeMessage("createGame")
  createGame(client: Socket, data: any) {
    console.log("create game event");
    const game = this.gameService.createGame(data.room, data.powerUps);

    // room.gameStarted to true
    data.room = this.roomService.updateRoom(data.room.id, {
      ...data.room,
      gameStarted: true,
    });
    // send new game to ongoing games
    this.server.emit("addGame", {
      id: game.gameId,
      player1: game.player1.infos,
      player2: game.player2.infos,
      score: "0/0",
    });
    // signal clients that game started
    this.server.to(data.room.id).emit("gameStarted", data.room);
    this.server.to(data.room.id).emit("updateStatus", "ingame");
    // start mainloop
    this.startGame(client, game);
  }

  @SubscribeMessage("getGame")
  getGame(client: Socket, userId: number) {
    const game = this.gameService.getGameForUser(userId);

    if (game) this.server.to(client.id).emit("newGame", game);
  }

  @SubscribeMessage("getCurrentGames")
  getCurrentGames(client: Socket, data: any) {
    const games = this.gameService.getCurrentGames();

    if (games) this.server.to(client.id).emit("newGames", games);
  }

  async endGame(game: GameType) {
    let room = this.roomService.findRoom(game.gameId);
    // save game in db
    const gameInfos = await this.gameService.register(game);

    // room game started to false
    //this.roomService.updateRoom(room.id, { ...room, gameStarted: false });

    // delete game + update users
    room = await this.gameService.updateRoom(room, gameInfos);
    this.server.to(room.id).emit("endGame", room);
    this.server.to(room.id).emit("updateStatus", "online");
    this.server
      .to(room.id)
      .emit("updateElo", { host: room.host.infos, guest: room.guest.infos });
    this.server.emit("deleteGame", game);
    this.gameService.deleteGame(game);
  }

  @SubscribeMessage("startGame")
  startGame(client: Socket, game: GameType) {
    //let n = 0;
    const gameLoop = setInterval(() => {
      /*n++;
      if (n % 60 === 0) {
        console.log(`interval ${n}`)
      }*/
      game = this.gameService.games.get(game.gameId);
      // Vérification de la fin de la partie
      if (game.player1.score >= 10) {
        clearInterval(gameLoop);
        game.player1.win = true;
        game.gameRunning = false;
      } else if (game.player2.score >= 10) {
        clearInterval(gameLoop);
        game.player2.win = true;
        game.gameRunning = false;
      } else {
        game = this.gameService.updateBall(game);
        if (game.powerUps) {
          game = this.gameService.spawnPowerUp(game);
          game = this.gameService.updatePowerUp(game);
        }
        this.gameService.saveGame(game);
      }
      // score update
      if (game.scoreUpdate) {
        game.scoreUpdate = false;
        this.server.emit("updateGames", game);
      }
      // signals
      this.server.to(game.gameId).emit("updateGameState", game);
      if (!game.gameRunning) {
        //clearInterval(gameLoop);
        this.endGame(game);
        return;
      }
    }, 1000 / 60);

    console.log("out game loop");
  }

  /*@SubscribeMessage("giveUp")
  giveUp(client: Socket, data: any) {
    console.log("giveUp");
    data.game.gameRunning = false;
    this.gameService.saveGame(data.game);
    this.server.to(data.game.gameId).emit("forfeit", data);
  }*/

  @SubscribeMessage("rematch")
  rematch(client: Socket, game: GameType) {
    game = this.gameService.resetGame(game);

    this.server.to(game.gameId).emit("gameReset", game);
    this.startGame(client, game);
  }

  @SubscribeMessage("movePaddle")
  movePaddle(client: Socket, data: any) {
    const game = this.gameService.movePaddle(
      data.game,
      data.playerId,
      data.direction
    );

    this.server.to(game.gameId).emit("updatePaddle", game);
  }

  @SubscribeMessage("stopPaddle")
  stopPaddle(client: Socket, data: any) {
    /*if (data.playerId === 1) {
      data.game.player1.paddle.up = false;
      data.game.player1.paddle.down = false;
    } else if (data.playerId === 2) {
      data.game.player2.paddle.up = false;
      data.game.player2.paddle.down = false;
    }
    this.gameService.saveGame(data.game);*/
  }

  // QUEUE

  emitOpponent(client: Socket, user: User, opponent: User) {
    console.log("emit stop queue");
    const room = this.roomService.getUserRoom(opponent.id);
    // stop queue
    this.server.to(room.id).emit("stopQueue");
    this.server.to(client.id).emit("stopQueue");
    if (!opponent) {
      console.log("opponent null, returning");
      return;
    }
    // join room
    console.log(`user ${user.username} joining room ${room.id}`);
    this.joinRoom(client, { user, id: opponent.id });
  }

  @SubscribeMessage("searchOpponent")
  searchOpponent(client: Socket, user: User) {
    console.log("search opponent event");
    let eloRange = 50;
    let n = 0;
    let opponent = this.queueService.findOpponent(user.id, user.elo, eloRange);

    // find opponent
    if (opponent) {
      console.log(`opponent found ${opponent.username}`);
      this.emitOpponent(client, user, opponent);
      return;
    }
    // queue up
    console.log(`opponent not found, queueing user ${user.username}`);
    const index = this.queueService.queueUp(user);
    const interval = setInterval(() => {
      console.log(`interval userId: ${user.id}, id: ${interval}`);
      console.log(`loop counter : ${n}`)
      n++;
      eloRange += 50;
      if (!this.queueService.checkQueued(index, user.id)) {
        console.log(`user ${user.username} not queued, exiting`);
        //clearInterval(interval);
        //this.emitOpponent(client, user, opponent);
        return;
      }
      opponent = this.queueService.findOpponent(user.id, user.elo, eloRange);
      if (opponent) {
        console.log(`opponent found ${opponent.username}`);
        //this.queueService.queue.splice(index, 1);
        //clearInterval(interval);
        this.queueService.stopQueue(user.id, index);
        this.emitOpponent(client, user, opponent);
        return;
      }
    }, 10000);
    
    this.queueService.addInterval(user.id, interval);
    console.log("out interval");
  }

  @SubscribeMessage("stopQueue")
  stopQueue(client: Socket, user: User) {
    console.log("stopQueue");
    this.queueService.stopQueue(user.id);
  }
}
