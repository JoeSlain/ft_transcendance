import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Namespace } from 'socket.io';
import { User } from 'src/database';
import { NotifData } from 'src/utils/types';
import { RoomService } from './room.service';

@WebSocketGateway(3003, {
  cors: {
    origin: 'http://localhost:3000',
  },
  namespace: 'game',
})

export class GameGateway {
  constructor (
    private readonly roomService: RoomService,
  ) {}

  @WebSocketServer() server: Namespace;

  @SubscribeMessage('createRoom')
  createRoom(client: Socket, user: User) {
    const room = this.roomService.createRoom(user);

    console.log('room', room);
    if (room) {
      client.join(user.id.toString());
      this.server.to(client.id).emit('createdRoom', room);
    }
    else
      console.log('error creating room');
  }

  @SubscribeMessage('joinRoom')
  joinRoom(client: Socket, notif: NotifData) {
    const joinStatus = this.roomService.joinRoom(notif.from.id, notif.to);

    if (joinStatus !== 'SUCCESS')
      this.server.to(client.id).emit('joinedRoomFailure', joinStatus);
    else {
      const room = this.roomService.findRoom(notif.from.id);
      console.log('room', room);
      this.server.to(client.id).emit('joinedRoom', room);
    }
  }
}
