import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Namespace } from 'socket.io';
import { User } from 'src/database';
import { UsersService } from 'src/users/users.service';

@WebSocketGateway(3002, {
  cors: {
    origin: 'http://localhost:3000',
  },
  namespace: 'chat',
})
export class ChatGateway {
  constructor (
    private readonly usersService: UsersService,
  ) {}

  @WebSocketServer() server: Namespace;

  // on connect new client
  @SubscribeMessage('updateStatus')
  async connect(client: Socket, data: any) {
    console.log('chat websocket updateStatus')
    console.log(data.userId);
    console.log(data.status);
    await this.usersService.updateStatus(data.userId, data.status, client.id);

    client.broadcast.emit('new_client', data);
  }

  @SubscribeMessage('invite')
  handleMessage(client: Socket, data: any) {
    console.log('chat websocket invite');
    
    console.log('to', data.to);
    console.log('data', data);
    this.server.to(data.to).emit('invited', data);
  }
}