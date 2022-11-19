import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { User } from 'src/database';
import { UsersService } from 'src/users/users.service';

@WebSocketGateway(3002, {
  cors: {
    origin: 'http://localhost:3000',
  },
  namespace: 'chat',
})
export class ChatGateway {
  @WebSocketServer() server: any;

  constructor (
    private readonly userService: UsersService,
  ) {}

  @SubscribeMessage('update_status')
  async connect(client: Socket, user: User) {
    client.emit('new_client', user);
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any): string {
    return 'Hello world!';
  }
}
