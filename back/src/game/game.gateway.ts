import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { userInfo } from "os";
import { Socket, Namespace } from "socket.io";
import { User } from "src/database";
import { NotifData, Room } from "src/utils/types";
import { GameService} from "./game.service";
import { RoomService } from "./room.service";

@WebSocketGateway(3003, {
  cors: {
    origin: "http://localhost:3000",
  },
  namespace: "game",
})
export class GameGateway {
  constructor(
    private readonly roomService: RoomService,
    private readonly gameService: GameService
  ) { }

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

  @SubscribeMessage('startGame')
  startGame(client: Socket, roomId: string) {
    console.log('start game event');
    const game = this.gameService.createGame(roomId);
    client.to(roomId).emit('gameStarted', game);
    console.log('start startGameLoop');
    this.gameService.startGameLoop(game, client, roomId);
    return game;
  }





}
