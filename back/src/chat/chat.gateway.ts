import { MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Namespace } from 'socket.io';
import { User } from 'src/database';
import { UsersService } from 'src/users/users.service';
import { ChatService } from './chat.service';

@WebSocketGateway(3002, {
  cors: {
    origin: 'http://localhost:3000',
  },
  namespace: 'chat',
})
export class ChatGateway implements OnGatewayConnection {
  constructor(
    private readonly usersService: UsersService,
    private readonly chatService: ChatService,
  ) { }

  @WebSocketServer() server: Namespace;

  handleConnection(client: Socket) {
    client.emit('connected')
  }

  // on connect new client
  @SubscribeMessage('login')
  async connect(client: Socket, data: any) {
    console.log('chat ws login')

    client.join(data.user.id);
    data.user = await this.usersService.updateStatus(data.user.id, data.status, client.id);
    if (data.user) {
      client.broadcast.emit('updateStatus', data);
      this.server.to(data.user.id).to(data.user.socketId).emit('loggedIn', data.user);
    }
    else
      console.log('error updating user status')
  }

  @SubscribeMessage('logout')
  async disconnect(client: Socket, data: any) {
    console.log('chat ws logout')
    data.user = await this.usersService.updateStatus(data.user.id, data.status, client.id);

    if (data.user)
      client.broadcast.emit('updateStatus', data);
    else
      console.log('error logging out')
  }

  @SubscribeMessage('notif')
  async notify(client: Socket, data: any) {
    console.log('chat websocket invite');

    //await this.chatService.createNotif(data);
    if (data.to.status === 'online')
      this.server.to(data.to.id).to(data.to.socketId).emit('notified', data);
  }

  @SubscribeMessage('acceptFriendRequest')
  async addFriend(client: Socket, data: any) {
    console.log('addFriend event');

    const newFriend = await this.usersService.addFriend(data.from, data.to);
    if (newFriend) {
      console.log('from', data.from)
      console.log('to', data.to)
      this.server.to(data.from.id).to(data.from.socketId).emit('newFriend', data.to)
      this.server.to(data.to.id).to(data.to.socketId).emit('newFriend', data.from)
    }
    else
      console.log('error adding friend')
  }

  @SubscribeMessage('deleteFriend')
  async deleteFriend(client: Socket, data: any) {
    console.log('deleteFriend event');

    const user1 = await this.usersService.deleteFriend(data.from, data.to.id);
    const user2 = await this.usersService.deleteFriend(data.to, data.from.id)
    if (user1 && user2) {
      this.server.to(data.from.id).to(data.from.socketId).emit('friendDeleted', data.to)
      this.server.to(data.to.id).to(data.to.socketId).emit('friendDeleted', data.from)
    }
    else
      console.log('error deleting friend')
  }
}