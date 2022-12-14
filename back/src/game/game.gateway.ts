import { OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Namespace } from 'socket.io';
import { User } from 'src/database';
import { NotifData, Room } from 'src/utils/types';
import { GameService } from './game.service';
import { RoomService } from './room.service';

@WebSocketGateway(3003, {
  cors: {
    origin: 'http://localhost:3000',
  },
  namespace: 'game',
})

export class GameGateway {
  constructor(
    private readonly roomService: RoomService,
    private readonly gameService: GameService,
  ) { }

  @WebSocketServer() server: Namespace;

  @SubscribeMessage('login')
  login(client: Socket, userId: number) {
    this.gameService.users.set(userId, client.id);
  }

  @SubscribeMessage('loggout')
  logout(client: Socket, userId: number) {
    this.gameService.users.delete(userId)
  }

  @SubscribeMessage('joinRoom')
  joinRoom(client: Socket, data: any) {
    console.log('join event')
    const room = this.roomService.joinRoom(data);

    if (!room)
      console.log('room full');
    else {
      console.log('return room', room);
      client.join(room.id);
      this.server.to(room.id).emit('joinedRoom', room);
    }
  }

  @SubscribeMessage('join')
  join(client: Socket, roomId: string) {
    client.join(roomId);
  }

  @SubscribeMessage('leaveRoom')
  leaveRoom(client: Socket, data: any) {
    console.log('leave room event')
    const room = this.roomService.leaveRoom(data.roomId, data.userId);
    const left = {
      userId: data.userId,
      room
    };

    console.log(`client ${data.userId} left`)
    client.to(data.roomId).emit('leftRoom', left);
    this.server.to(client.id).emit('clearRoom');
    //client.leave(data.roomId);
  }
}
