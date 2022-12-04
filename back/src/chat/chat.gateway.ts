import { MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { map } from 'rxjs';
import { Socket, Namespace } from 'socket.io';
import { Notif, User } from 'src/database';
import { NotifService } from 'src/users/notifs.service';
import { UsersService } from 'src/users/users.service';
import { ChatService } from './chat.service';
import { NotifData } from '../utils/types';

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
    private readonly notifService: NotifService,
  ) { }

  @WebSocketServer() server: Namespace;

  handleConnection(client: Socket) {
    client.emit('connected')
  }

  /* LOGIN
  ** clientSocket.emit('login', me: User)
  ** serverSocket.respond('loggedIn', me: User)
  */
  @SubscribeMessage('login')
  async connect(client: Socket, data: any) {
    console.log('chat ws login')

    this.chatService.addUser(data.user.id, client.id);
    if (data.user) {
      data.status = 'online';
      client.broadcast.emit('updateStatus', data);
      this.server.to(client.id).emit('loggedIn', data.user);
    }
    else
      console.log('error updating user status')
  }

  /* LOGOUT
  ** clientSocket.emit('logout', me: User)
  ** serverSocket.broadcast('updateStatus', me: User)
  */
  @SubscribeMessage('logout')
  async disconnect(client: Socket, data: any) {
    console.log('chat ws logout')
    this.chatService.removeUser(data.user.id);

    if (data.user) {
      data.status = 'offline';
      client.broadcast.emit('updateStatus', data);
    }
    else
      console.log('error logging out')
  }

  /* GET FRIENDS
  ** clientSocket.emit('getFriends', me: User)
  ** serverSocket.respond('friends', {
      friends: Array<User>,
      statuses: JSON string 
      (use new Map(JSON.parse(data.statuses)) on client side)
    })
  */
  @SubscribeMessage('getFriends')
  async getFriends(client: Socket, data: User) {
    const friends = await this.usersService.getFriends(data);
    const map = new Map();

    friends.forEach(friend => {
      if (this.chatService.getUser(friend.id))
        map.set(friend.id, 'online');
      else
        map.set(friend.id, 'offline');
    })
    const ret = {
      friends: friends,
      statuses: JSON.stringify(Array.from(map)),
    }

    this.server.to(client.id).emit('friends', ret)
  }

  /* LOGOUT
  ** clientSocket.emit('logout', notif: NotifData)
  ** serverSocket.respondTo(notif.to)('notified', notif: Notif)
  */
  @SubscribeMessage('notif')
  async notify(client: Socket, data: NotifData) {
    console.log('chat websocket invite');

    if (data.type === 'Friend Request') {
      const friend = await this.usersService.findFriend(data.from.id, data.to.id);
      if (friend.length)
        return;
    }
    await this.notifService.createNotif(data);
    const to = this.chatService.getUser(data.to.id);
    if (to)
      this.server.to(to).emit('notified', data);
  }

  @SubscribeMessage('acceptFriendRequest')
  async addFriend(client: Socket, data: NotifData) {
    console.log('addFriend event');
    console.log('from', data.from)
    console.log('to', data.to)

    const newFriend = await this.usersService.addFriend(data.from, data.to);
    if (newFriend) {
      await this.notifService.deleteNotif(data);
      const from = this.chatService.getUser(data.from.id);
      if (from)
        this.server.to(from).emit('newFriend', data.to)
      this.server.to(client.id).emit('newFriend', data.from)
    }
    else
      console.log('error adding friend')
  }

  @SubscribeMessage('declineFriendRequest')
  async deleteNotif(client: Socket, data: NotifData) {
    console.log('decline friend event')
    /*console.log('from', data.from)
    console.log('to', data.to)*/

    await this.notifService.deleteNotif(data);
  }

  @SubscribeMessage('deleteFriend')
  async deleteFriend(client: Socket, data: NotifData) {
    console.log('deleteFriend event');

    const user1 = await this.usersService.deleteFriend(data.from, data.to.id);
    const user2 = await this.usersService.deleteFriend(data.to, data.from.id)
    if (user1 && user2) {
      const to = this.chatService.getUser(data.to.id);
      if (to)
        this.server.to(to).emit('friendDeleted', data.from)
      this.server.to(client.id).emit('friendDeleted', data.to)
    }
    else
      console.log('error deleting friend')
  }
}