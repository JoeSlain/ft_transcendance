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
import { GameService } from "./game.service";
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
  ) {}

  @WebSocketServer() server: Namespace;

  @SubscribeMessage("login")
  login(client: Socket, userId: number) {
    this.gameService.users.set(userId, client.id);
  }

  @SubscribeMessage("loggout")
  logout(client: Socket, userId: number) {
    this.gameService.users.delete(userId);
  }

  @SubscribeMessage("getRoom")
  getRoom(client: Socket, userId: number) {
    const room = this.roomService.getUserRoom(userId);

    if (room) this.server.to(client.id).emit("newRoom", room);
  }

  @SubscribeMessage("joinRoom")
  joinRoom(client: Socket, data: any) {
    console.log("join event");
    let room = this.roomService.usersRooms.get(data.user.id);

    if (room) {
      if (room.id !== data.roomId && !room.gameStarted) {
        console.log("leaving previous room", room.id);

        const leaveData = {
          roomId: room.id,
          userId: data.user.id,
        };
        this.leaveRoom(client, leaveData);
      } else return;
    }

    room = this.roomService.joinRoom(data);
    if (!room)
      this.server.to(client.id).emit("error", `couldn't join room : room full`);
    else {
      console.log("return room", room);

      this.roomService.usersRooms.set(data.user.id, room);
      client.join(room.id);
      this.server.to(room.id).emit("joinedRoom", room);
    }
  }

  @SubscribeMessage("join")
  join(client: Socket, roomId: string) {
    client.join(roomId);
  }

  @SubscribeMessage("leaveRoom")
  leaveRoom(client: Socket, data: any) {
    console.log("leave room event");
    const room = this.roomService.leaveRoom(data.roomId, data.userId);
    const left = {
      userId: data.userId,
      room,
    };

    console.log(`client ${data.userId} left room ${data.roomId}`);
    client.to(data.roomId).emit("leftRoom", left);
    this.server.to(client.id).emit("clearRoom");
    client.leave(data.roomId);
  }

  @SubscribeMessage("spectate")
  spectate(client: Socket, data: any) {
    console.log("spectatate event");
    const room = this.roomService.usersRooms.get(data.user.id);

    if (!room)
      this.server
        .to(client.id)
        .emit("error", `user ${data.user.username} is not currently in a game`);
    else {
      this.roomService.addSpectator(data.me, room);
      client.join(room.id);
      this.server.to(room.id).emit("joinedRoom", room);
    }
  }
}
