import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { map } from 'rxjs';
import { Socket, Namespace } from 'socket.io';
import { Notif, User } from 'src/database';
import { NotifService } from 'src/users/notifs.service';
import { UsersService } from 'src/users/users.service';
import { ChatService } from './chat.service';
import { NotifData } from '../utils/types';
import { RoomService } from 'src/game/room.service';

@WebSocketGateway(3002, {
  cors: {
    origin: "http://localhost:3000",
  },
  namespace: "chat",
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly usersService: UsersService,
    private readonly chatService: ChatService,
    private readonly notifService: NotifService,
    private readonly roomService: RoomService,
  ) { }

  @WebSocketServer() server: Namespace;

  handleConnection(client: Socket) {}

  handleDisconnect(client: any) {}

  /* LOGIN
  ** description: sauvegarde l'id du socket du client qui vient de s'authentifier
      via 42api et signale a tous les utilisateurs authentifies qu'un nouveau client
      vient de se connecter
  ** signal emis cote client: clientSocket.emit('login', user)
  ** reponse broadcast: 'updateStatus', {user, status}
  ** reponse client: 'loggedIn', {user} */
  @SubscribeMessage('login')
  async login(client: Socket, user: User) {
    const data = {
      user,
      status: "online",
    };
    console.log("chat ws login");

    this.chatService.addUser(user.id, client.id);
    client.broadcast.emit("updateStatus", data);
    this.server.to(client.id).emit("loggedIn", user);
  }

  /* LOGOUT
  ** description: efface l'id du socket du client qui s'est logout et signale
      a tous les utilisateurs authentifies qu'un utilisateur vient de se deconnecter
  ** signal client: clientSocket.emit('logout', user)
  ** reponse broadcast: 'updateStatus', {user, status})
  ** reponse client: 'loggedOut', pas de params */
  @SubscribeMessage('logout')
  async logout(client: Socket, user: User) {
    const data = {
      user,
      status: "offline",
    };
    console.log("chat ws logout");

    if (this.chatService.removeUser(user.id))
      client.broadcast.emit("updateStatus", data);
    else console.log("error logging out");
    this.server.to(client.id).emit("loggedOut");
  }

  /* GET FRIENDS
  ** description: recupere les amis de l'utilisateur user dans la db
      et renvoie les amis dans un array d'utilisateurs au client,
      ainsi qu'une map de statuts [key=friendId, value=friendStatus]
      correspondant au statut des amis renvoyes (online/offline/ingame)
  ** signal client: clientSocket.emit('getFriends', user)
  ** reponse client: 'friends', {friends, statuses}
  ** utilisation de la map de statuts cote client : socketio ne permet pas de serialiser/deserialiser
      le type map. On envoie donc au client la map convertie en array puis convertie en string.
      Pour utiliser la map de statuts cote client, faire : new Map(JSON.parse(ret.statuses)) pour
      reconvertir la JSON string en map.
  */
  @SubscribeMessage('getFriends')
  async getFriends(client: Socket, user: User) {
    const friends = await this.usersService.getFriends(user);
    const map = new Map();

    friends.forEach((friend) => {
      if (this.chatService.getUser(friend.id)) map.set(friend.id, "online");
      else map.set(friend.id, "offline");
    });
    const ret = {
      friends: friends,
      statuses: JSON.stringify(Array.from(map)),
    };

    this.server.to(client.id).emit('friends', ret);
  }

  /* NOTIF
  ** description: event qui gere toutes les interactions entre utilisateurs
      (ajout d'amis, invitation a jouer...)
      Le client emet le signal 'notif' au serveur, avec en parametre un objet NotifData.
      L'objet NotifData contient les champs : {
        type: string, type de la demande ('Friend Request' || 'Game Invite')
        to: user destinataire de la demande
        from: User, user emettant la demande
      }
      Le serveur sauvegarde la notification dans la db et signale alors l'utilisateur
      destinataire qu'il a recu une notification, en lui renvoyant cet objet notifData.
  ** signal client: clientSocket.emit('notif', notif)
  ** reponse destinataire: 'notified', {notifData}
  */
  @SubscribeMessage('notif')
  async notify(client: Socket, notif: NotifData) {
    console.log('chat websocket invite');

    if (notif.type === 'Friend Request') {
      const friend = await this.usersService.findFriend(notif.from.id, notif.to.id);
      if (friend.length) {
        this.server.to(client.id).emit('error', `friend ${notif.to.username} already added`)
        return;
      }
      await this.notifService.createNotif(notif);
    }
    const to = this.chatService.getUser(notif.to.id);
    if (to)
      this.server.to(to).emit('notified', notif);
  }

  /* ACCEPT FRIEND
  ** description: ajoute les users from et to de la notif en amis dans la db,
      puis signale les users qu'ils sont devenus amis
  ** clientSocket.emit('acceptFriendRequest', notif)
  ** reponse user to: 'newFriend', {from}
  ** reponse user from: 'newFriend', {to}
  */
  @SubscribeMessage('acceptFriendRequest')
  async addFriend(client: Socket, notif: NotifData) {
    console.log('addFriend event');
    console.log('from', notif.from);
    console.log('to', notif.to);

    const newFriend = await this.usersService.addFriend(notif.from, notif.to);
    if (newFriend) {
      await this.notifService.deleteNotif(notif);
      const from = this.chatService.getUser(notif.from.id);
      if (from)
        this.server.to(from).emit('newFriend', notif.to);
      this.server.to(client.id).emit('newFriend', notif.from);
    }
    else
      console.log('error adding friend');
  }

  /* DECLINE FRIEND
  ** description: en cas de refus d'ajout en amis, on se contente de
      supprimer la notification de la database et on ne repond rien au client
  ** signal client: clientSocket.emit('declineFriendRequest', notif)
  ** 
  */ 
  @SubscribeMessage('declineFriendRequest')
  async deleteNotif(client: Socket, notif: NotifData) {
    console.log('decline friend event');

    await this.notifService.deleteNotif(notif);
  }

  /* DELETE FRIEND
  ** description: unfriend notif.from et notif.to dans la db et signale
      les users from et to qu'ils ne sont plus amis
  ** signal client: clientSocket.emit('deleteFriend', notif)
  ** reponse user to: 'friendDeleted', {notif.from}
  ** reponse user from: 'friendDeleted', {notif.to} */
  @SubscribeMessage('deleteFriend')
  async deleteFriend(client: Socket, notif: NotifData) {
    console.log('deleteFriend event');

    const user1 = await this.usersService.deleteFriend(notif.from, notif.to.id);
    const user2 = await this.usersService.deleteFriend(notif.to, notif.from.id)
    if (user1 && user2) {
      const to = this.chatService.getUser(notif.to.id);
      if (to)
        this.server.to(to).emit('friendDeleted', notif.from);
      this.server.to(client.id).emit('friendDeleted', notif.to);
    }
    else
      console.log('error deleting friend');
  }

  /* ACCEPT INVITE
  ** description: notifie les users notif.from et notif.to que l'utilisateur
      notif.to a accepte l'invitation a jouer. Le serveur renvoie aux utilisateurs
      l'id de l'utilisateur qui a emis l'invitation a jouer. Cet id peut alors etre
      utilise cote client pour emettre une nouvelle requete pour rejoindre la gameRoom
      dont l'id est notif.from.id
  ** signal client: clientSocket.emit('acceptInvite', notif)
  ** reponse user from: 'acceptedInvite', notif.from.id
  ** reponse user to: 'acceptedInvite', notif.from.id */
  @SubscribeMessage('acceptInvite')
  async acceptInvite(client: Socket, notif: NotifData) {
    const from = this.chatService.getUser(notif.from.id);

    if (from) {
      this.server.to(from).emit('acceptedInvite', notif.from.id);
      this.server.to(client.id).emit('acceptedInvite', notif.from.id);
    }
  }
}
