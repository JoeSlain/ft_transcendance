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

  @SubscribeMessage('updateStatus')
  async connect(client: Socket, data: any) {
    console.log('chat websocket on update datas')
    console.log(data.userId);
    console.log(data.status);
    await this.usersService.updateStatus(data.userId, data.status);

    this.server.emit('new_client', data);
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any): string {
    return 'Hello world!';
  }
}
