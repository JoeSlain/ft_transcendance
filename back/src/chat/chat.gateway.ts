import { MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Namespace } from 'socket.io';
import { User } from 'src/database';
import { UsersService } from 'src/users/users.service';

@WebSocketGateway(3002, {
  cors: {
    origin: 'http://localhost:3000',
  },
  namespace: 'chat',
})
export class ChatGateway implements OnGatewayConnection {
  constructor (
    private readonly usersService: UsersService,
  ) {}

  @WebSocketServer() server: Namespace;

  handleConnection(client: Socket) {
    client.emit('connected')
  }

  // on connect new client
  @SubscribeMessage('login')
  async connect(client: Socket, data: any) {
    console.log('chat ws login')
    console.log('userId', data.user.id);
    console.log(data.status);
    console.log('socketId', client.id);
    await this.usersService.updateStatus(data.user.id, data.status, client.id);

    client.join(data.user.id);
    client.broadcast.emit('updateStatus', data);
  }

  @SubscribeMessage('logout')
  async disconnect(client: Socket, data: any) {
    console.log('chat ws logout')
    await this.usersService.updateStatus(data.user.id, data.status, client.id);

    client.broadcast.emit('updateStatus', data);
  }

  @SubscribeMessage('notif')
  notify(client: Socket, data: any) {
    console.log('chat websocket invite');
    
    console.log('to', data.to);
    console.log('data', data);
    console.log('client', client);
    console.log('userId', data.to.id)
    this.server.to(data.to.id).to(data.to.socketId).emit('notified', data);
  }

  @SubscribeMessage('acceptFriendRequest')
  async addFriend(client: Socket, data: any) {
    console.log('addFriend event');

    const newFriend = await this.usersService.addFriend(data.from, data.to.username);
    if (newFriend) {
      this.server.to(data.from.id).to(data.from.socketId).emit('newFriend', data.to)
      this.server.to(data.to.id).to(data.to.socketId).emit('newFriend', data.from)
    }
    else
      console.log('error adding friend')
  }

  @SubscribeMessage('deleteFriend')
  async deleteFriend(client: Socket, data: any) {
    console.log('deleteFriend event');

    const user = await this.usersService.deleteFriend(data.from, data.to.id);
    if (user) {
      this.server.to(data.from.id).to(data.from.socketId).emit('friendDeleted', data.to)
      this.server.to(data.to.id).to(data.to.socketId).emit('friendDeleted', data.from)
    }
    else
      console.log('error deleting friend')
  }
}