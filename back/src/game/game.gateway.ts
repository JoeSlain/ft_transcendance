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
import { GameService, GameType, PlayerType, BallType, PaddleType } from "./game.service";
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

  @SubscribeMessage('createGame')
createGame(client: Socket, game: GameType, gameData: { width: number; height: number }) {
  console.log("createGame event");
  game = this.gameService.createGame(gameData);
  // ajouter le joueur à la partie
  this.gameService.addPlayer(game, client.id, client); 
  
  this.gameService.startGame(game);

  while (game.running) {
    game = this.gameService.moveBall(game);

    this.server.to(game.id.toString()).emit('updateGame', game);
    
 }
}

@SubscribeMessage('movePaddle')
movePaddle(client: Socket, data: any) {
  console.log("movePaddle event");
  const game = this.gameService.games.get(data.roomId);
  if (!game) return; // si la partie n'existe pas, on ne fait rien

  const player = game.players.find(p => p.id === client.id);
  if (!player) return; // si le joueur n'est pas dans la partie, on ne fait rien

  // on met à jour la position de la raquette du joueur
  player.paddle = this.gameService.movePaddle(game, player.id, data.direction, data.speed);
  // on envoie les nouvelles données de la partie à tous les joueurs
  this.server.to(data.roomId).emit('updateGame', game);
}


}
