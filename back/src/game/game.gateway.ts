import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { userInfo } from "os";
import { Socket, Namespace } from "socket.io";
import { User } from "src/database";
import { GameType, NotifData, Room } from "src/utils/types";
import { GameService } from "./game.service";
import { RoomService } from "./room.service";
import { QueueService } from "./queue.service";

@WebSocketGateway(3003, {
  cors: {
    origin: "http://localhost:3000",
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

    if (room) {
      const roomLeft = this.roomService.leaveRoom(room.id, user.id);
      client.to(room.id).emit("leftRoom", roomLeft);
      client.leave(room.id);
    }
  }

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

    if (!room) {
      this.server.to(client.id).emit("error", "game room not found");
      return null;
    }
    const prevRoom = this.roomService.getUserRoom(data.user.id);
    if (prevRoom) {
      if (prevRoom.id !== room.id && !prevRoom.gameStarted)
        this.leaveRoom(client, { roomId: prevRoom.id, user: data.user });
      else return;
    }
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

    if (!room) {
      this.server
        .to(client.id)
        .emit("error", ` ${data.user.username} is not currently in a game`);
      return;
    }
    const prevRoom = this.roomService.getUserRoom(data.me.id);
    if (prevRoom) {
      if (prevRoom.id !== room.id && !prevRoom.gameStarted)
        this.leaveRoom(client, { roomId: prevRoom.id, user: data.me });
      else return;
    }
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

  @SubscribeMessage("createGame")
  createGame(client: Socket, room: Room) {
    console.log("create game event");
    const game = this.gameService.createGame(room);

    console.log("game", game);
    this.server.to(room.id).emit("gameCreated");
  }

  @SubscribeMessage("getGame")
  getGame(client: Socket, userId: number) {
    const game = this.gameService.getGameForUser(userId);

    if (game) this.server.to(client.id).emit("newGame", game);
  }

  @SubscribeMessage("startGame")
  startGame(client: Socket, game: GameType) {
    const gameLoop = setInterval(() => {
      game = this.gameService.updateBall(game);

      // Vérification de la fin de la partie
      if (game.player1.score >= 10) {
        clearInterval(gameLoop);
        game.player1.win = true;
        game.gameRunning = false;
        return game;
      }
      if (game.player2.score >= 10) {
        clearInterval(gameLoop);
        game.player2.win = true;
        game.gameRunning = false;
        return game;
      }
      console.log("gameLoop", game);
      this.server.to(game.gameId).emit("updateGameState", game);
    }, 1000 / 60);
  }

  /* @SubscribeMessage("startGame")
  startGame(client: Socket, room: Room) {
    console.log("start game event");
    const game = this.gameService.createGame();
    // this.gameService.addUsersFromRoom(room)
    this.gameService.startGame(game);
    this.server.to(room.id).emit("updateGameState", game);
    /*client.to(room.id).emit("gameStarted", game);
    console.log("start startGameLoop");
    this.gameService.startGameLoop(game, room);
    return game;
  }*/

  @SubscribeMessage("movePaddle")
  movePaddle(client: Socket, data: any) {
    const game = this.gameService.movePaddle(
      data.game,
      data.playerId,
      data.direction
    );

    this.server.to(game.gameId).emit("updateGameState", game);
  }

  emitOpponent(client: Socket, user: User, opponent: User) {
    console.log("emit stop queue");
    const room = this.roomService.getUserRoom(opponent.id);
    this.server.to(room.id).emit("stopQueue");
    this.server.to(client.id).emit("stopQueue");
    if (!opponent) {
      console.log("opponent null, returning");
      return;
    }
    console.log(`user ${user.username} joining room ${room.id}`);
    this.joinRoom(client, { user, id: opponent.id });
  }

  @SubscribeMessage("searchOpponent")
  searchOpponent(client: Socket, user: User) {
    console.log("search opponent event");
    let eloRange = 50;
    let n = 0;
    let opponent = this.queueService.findOpponent(user.id, user.elo, eloRange);

    if (opponent) {
      console.log(`opponent found ${opponent.username}`);
      this.emitOpponent(client, user, opponent);
      return;
    }
    console.log(`opponent not found, queueing user ${user.username}`);
    const index = this.queueService.queueUp(user);
    const interval = setInterval(() => {
      console.log(`interval ${n}`);
      n++;
      eloRange += 50;
      if (!this.queueService.checkQueued(index, user.id)) {
        console.log(`user ${user.username} not queued, exiting`);
        clearInterval(interval);
        //this.emitOpponent(client, user, opponent);
        return;
      }
      opponent = this.queueService.findOpponent(user.id, user.elo, eloRange);
      if (opponent) {
        console.log(`opponent found ${opponent.username}`);
        this.queueService.queue.splice(index, 1);
        clearInterval(interval);
        this.emitOpponent(client, user, opponent);
        return;
      }
    }, 10000);
    console.log("out interval");
  }

  @SubscribeMessage("stopQueue")
  stopQueue(client: Socket, user: User) {
    console.log("stopQueue");
    this.queueService.stopQueue(user.id);
  }
}
