import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Namespace } from 'socket.io';
import { User } from 'src/database';
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
  handleMessage(client: Socket, user: User) {
    const room = this.roomService.createRoom(user);

    console.log('room', room);
    if (room) {
      client.join(user.id.toString());
      this.server.to(client.id).emit('createdRoom', room);
    }
    else
      console.log('error creating room');
  }
}
