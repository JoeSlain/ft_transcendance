import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { map } from "rxjs";
import { Socket, Namespace } from "socket.io";
import { ChanMessage, Channel, Conversation, Notif, User } from "src/database";
import { NotifService } from "src/users/notifs.service";
import { UsersService } from "src/users/users.service";
import { ChatService } from "./chat.service";
import { ChannelData, MessageData, NotifData } from "../utils/types";
import { RoomService } from "src/game/room.service";
import { ChannelService } from "./channel.service";
import * as bcrypt from "bcrypt";
import { MessageService } from "./message.service";
import { RestrictionService } from "./restrictions.service";
import { GameService } from "src/game/game.service";

@WebSocketGateway(3002, {
  cors: {
    origin: "http://10.11.7.11:3000",
  },
  namespace: "chat",
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly usersService: UsersService,
    private readonly chatService: ChatService,
    private readonly notifService: NotifService,
    private readonly channelService: ChannelService,
    private readonly messageService: MessageService,
    private readonly restrictionService: RestrictionService,
    private readonly gameService: GameService
  ) {}

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
  @SubscribeMessage("login")
  async login(client: Socket, user: User) {
    const data = {
      user,
      status: "online",
    };
    console.log("chat ws login", user);
    if (this.gameService.getGameForUser(user.id)) data.status = "ingame";
    this.chatService.addUser(user.id, client.id, data.status);
    client.broadcast.emit("updateStatus", data);
    this.server.to(client.id).emit("loggedIn", user);
  }

  /* LOGOUT
  ** description: efface l'id du socket du client qui s'est logout et signale
      a tous les utilisateurs authentifies qu'un utilisateur vient de se deconnecter
  ** signal client: clientSocket.emit('logout', user)
  ** reponse broadcast: 'updateStatus', {user, status})
  ** reponse client: 'loggedOut', pas de params */
  @SubscribeMessage("logout")
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

  @SubscribeMessage("updateUser")
  async updateUser(client: Socket, user: User) {
    console.log("update user", user);
    const status = this.chatService.getUserStatus(user.id);
    client.broadcast.emit("updateStatus", { user, status });
    client.broadcast.emit("updateConvs", user);
    client.broadcast.emit("updateSelectedChan", user);
  }

  @SubscribeMessage("updateUserStatus")
  async updateUserStatus(client: Socket, data: any) {
    this.chatService.updateUserStatus(data.user.id, data.status);
    client.broadcast.emit("updateStatus", {
      user: data.user,
      status: data.status,
    });
  }

  /*@SubscribeMessage("updateUserElo")
  async updateUserElo(client: Socket, data: any) {
    const user = await this.usersService.updateUserElo(
      data.user.id,
      data.gameInfos
    );

    this.server.to(client.id).emit("eloUpdated", user);
  }*/

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
  @SubscribeMessage("getFriends")
  async getFriends(client: Socket, user: User) {
    const friends = await this.usersService.getFriends(user);
    const map = new Map();

    friends.forEach((friend) => {
      const status = this.chatService.getUserStatus(friend.id);
      map.set(friend.id, status);
    });
    const ret = {
      friends: friends,
      statuses: JSON.stringify(Array.from(map)),
    };

    this.server.to(client.id).emit("friends", ret);
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
  @SubscribeMessage("notif")
  async notify(client: Socket, data: NotifData) {
    console.log("chat websocket invite");

    if (data.from.id === data.to.id) {
      this.server.to(client.id).emit("error", "invalid target");
      return;
    }
    if (data.type === "Friend Request") {
      const friend = await this.usersService.findFriend(
        data.from.id,
        data.to.id
      );
      if (friend.length) {
        this.server
          .to(client.id)
          .emit("error", `friend ${data.to.username} already added`);
        return;
      }
    }
    const notif = await this.notifService.createNotif(data);
    console.log("notif", notif);
    if (notif) {
      const to = this.chatService.getUser(notif.to.id);
      console.log("to", to);
      if (to) this.server.to(to).emit("notified", notif);
    }
  }

  /* ACCEPT FRIEND
  ** description: ajoute les users from et to de la notif en amis dans la db,
      puis signale les users qu'ils sont devenus amis
  ** clientSocket.emit('acceptFriendRequest', notif)
  ** reponse user to: 'newFriend', {from}
  ** reponse user from: 'newFriend', {to}
  */
  @SubscribeMessage("acceptFriendRequest")
  async addFriend(client: Socket, notif: Notif) {
    console.log("addFriend event");

    const newFriend = await this.usersService.addFriend(notif.from, notif.to);
    if (newFriend) {
      const toStatus = this.chatService.getUserStatus(notif.to.id);
      const fromStatus = this.chatService.getUserStatus(notif.from.id);

      const from = this.chatService.getUser(notif.from.id);
      if (from) {
        this.server
          .to(from)
          .emit("newFriend", { friend: notif.to, status: toStatus });
      }
      this.server
        .to(client.id)
        .emit("newFriend", { friend: notif.from, status: fromStatus });
    } else console.log("error adding friend");
    await this.notifService.deleteNotif(notif);
  }

  /* DECLINE FRIEND
  ** description: en cas de refus d'ajout en amis, on se contente de
      supprimer la notification de la database et on ne repond rien au client
  ** signal client: clientSocket.emit('declineFriendRequest', notif)
  ** 
  */
  @SubscribeMessage("deleteNotif")
  async deleteNotif(client: Socket, notif: Notif) {
    console.log("decline event");
    await this.notifService.deleteNotif(notif);
  }

  /* DELETE FRIEND
  ** description: unfriend notif.from et notif.to dans la db et signale
      les users from et to qu'ils ne sont plus amis
  ** signal client: clientSocket.emit('deleteFriend', notif)
  ** reponse user to: 'friendDeleted', {notif.from}
  ** reponse user from: 'friendDeleted', {notif.to} */
  @SubscribeMessage("deleteFriend")
  async deleteFriend(client: Socket, data: any) {
    console.log("deleteFriend event");

    const user1 = await this.usersService.deleteFriend(data.user, data.friend);
    const user2 = await this.usersService.deleteFriend(data.friend, data.user);
    if (user1 && user2) {
      const to = this.chatService.getUser(data.friend.id);
      if (to) this.server.to(to).emit("friendDeleted", data.user);
      this.server.to(client.id).emit("friendDeleted", data.friend);
    } else this.server.to(client.id).emit("error", "error deleting friend");
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
  @SubscribeMessage("acceptGameInvite")
  async acceptInvite(client: Socket, notif: Notif) {
    const from = this.chatService.getUser(notif.from.id);

    if (from) {
      this.server.to(from).emit("acceptedInvite", notif.from.id);
      this.server.to(client.id).emit("acceptedInvite", notif.from.id);
    } else
      this.server
        .to(client.id)
        .emit("error", "error: this invitation has expired");
    await this.notifService.deleteNotif(notif);
  }

  @SubscribeMessage("getChannels")
  async getChannels(client: Socket, userId: number) {
    const privateChans = await this.channelService.getPrivateChannels(userId);
    const publicChans = await this.channelService.getPublicChannels();

    this.server.to(client.id).emit("channels", { privateChans, publicChans });
  }

  @SubscribeMessage("createChannel")
  async createChannel(client: Socket, chanData: ChannelData) {
    console.log("create channel");
    const error = await this.channelService.checkChanData(chanData);
    if (error) this.server.to(client.id).emit("error", error);
    else {
      const channel = await this.channelService.createChannel(chanData);
      //console.log("returned channel", channel);

      if (!channel)
        this.server.to(client.id).emit("error", "invalid chan name");
      else {
        if (channel.type !== "private") this.server.emit("newChannel", channel);
        else this.server.to(client.id).emit("newChannel", channel);
        client.join(channel.socketId);
      }
    }
  }

  async checkChanPassword(client: Socket, data: any) {
    const channel = await this.channelService.findChannelById(data.channel.id);
    if (!channel) {
      this.server.to(client.id).emit("error", "channel not found");
      return false;
    }
    if (channel.type === "protected") {
      let check = false;
      if (data.channel.password) {
        check = await this.channelService.checkChanPassword(
          data.channel.password,
          channel.password
        );
      }
      if (!check) {
        this.server.to(client.id).emit("wrongPassword");
        return false;
      }
    }
    return true;
  }

  @SubscribeMessage("joinChannel")
  async joinChannel(client: Socket, data: any) {
    let channel = await this.channelService.findChannelById(data.channel.id);

    if (await this.restrictionService.isBanned(data.user.id, channel)) {
      const ban = await this.restrictionService.getBanned(
        data.user.id,
        channel
      );
      this.server
        .to(client.id)
        .emit(
          "error",
          `You cannot join this channel because you have been banned until ${ban.end}`
        );
      return;
    }
    if (!(await this.checkChanPassword(client, data))) return;
    if (!this.channelService.findUserInChan(data.user.id, channel)) {
      channel = await this.channelService.addUserChan(
        data.user,
        channel,
        "users"
      );
      if (!channel.owner)
        channel = await this.channelService.setChanOwner(data.user, channel);
    }
    data.channel = { ...channel, password: null };
    client.join(data.channel.socketId);
    client.to(data.channel.socketId).emit("updateChannel", data.channel);
    this.server.to(client.id).emit("joinedChannel", data.channel);
    return data.channel;
  }

  @SubscribeMessage("deleteChannel")
  async deleteChannel(client: Socket, data: any) {
    console.log("delete channel");
    //console.log("preleave", data.channel);

    const channel = await this.channelService.leaveChan(
      data.user,
      data.channel
    );
    //console.log("postleave", data.channel);
    if (!channel) this.server.emit("removeChannel", data.channel);
    else this.server.to(client.id).emit("removeChannel", data.channel);
    if (channel)
      this.server.to(data.channel.socketId).emit("leftChannel", channel);
    client.leave(data.channel.socketId);
  }

  @SubscribeMessage("leaveChannel")
  async leaveChannel(client: Socket, data: any) {
    console.log("leave channel");
    const channel = await this.channelService.leaveChan(
      data.user,
      data.channel
    );
    //console.log("postleave", data.channel);
    if (!channel)
      this.server.to(data.channel.socketId).emit("removeChannel", data.channel);
    else this.server.to(channel.socketId).emit("leftChannel", channel);
    this.server.to(client.id).emit("leftChannel", channel);
    client.leave(data.channel.socketId);
  }

  @SubscribeMessage("chanInvite")
  async chanInvite(client: Socket, data: NotifData) {
    console.log("chan invite");
    if (this.channelService.findUserInChan(data.to.id, data.channel)) {
      this.server.to(client.id).emit("error", "user already in chan");
      return;
    }
    const to = this.chatService.getUser(data.to.id);
    const notif = await this.notifService.createNotif(data);
    console.log("notif", notif);
    if (notif && to) {
      this.server.to(to).emit("notified", notif);
    }
  }

  @SubscribeMessage("acceptChannelInvite")
  async acceptChanInvite(client: Socket, notif: Notif) {
    await this.notifService.deleteNotif(notif);
    const channel = await this.joinChannel(client, {
      user: notif.to,
      channel: notif.channel,
    });
    if (channel) this.server.to(client.id).emit("newChannel", channel);
  }

  @SubscribeMessage("chanMessage")
  async message(client: Socket, data: MessageData) {
    console.log("new message");
    const channel = await this.channelService.findChannelById(data.channel.id);
    if (!channel) {
      this.server.to(client.id).emit("error", "channel not found");
      return;
    }
    if (
      data.from &&
      (await this.restrictionService.isMuted(data.from.id, channel))
    ) {
      const mute = await this.restrictionService.getMuted(
        data.from.id,
        channel
      );
      this.server
        .to(client.id)
        .emit(
          "error",
          `You cannot write in this channel because you have been muted until ${mute.end}`
        );
      return;
    }
    console.log("creating msg");
    const message = await this.messageService.createChanMessage({
      content: data.content,
      from: data.from,
      channel,
    });
    //console.log("ret msg", message);
    console.log("returning new msg");
    if (!message)
      this.server.to(client.id).emit("error", "error creating message");
    else this.server.to(data.channel.socketId).emit("newMessage", message);
  }

  @SubscribeMessage("setChannelPassword")
  async setChannelPassword(client: Socket, data: any) {
    if (!this.checkChanPassword(client, data)) return;
    const channel = await this.channelService.setChanPassword(
      data.channel,
      data.newPassword
    );
    if (data.channel.type === "public") {
      channel.password = null;
      this.server.emit("updateChannel", channel);
    }
  }

  @SubscribeMessage("removeChannelPassword")
  async removeChannelPassword(client: Socket, channel: Channel) {
    if (!(await this.checkChanPassword(client, { channel }))) return;
    channel = await this.channelService.findChannelById(channel.id);
    channel = await this.channelService.removeChanPassword(channel);
    this.server.emit("updateChannel", channel);
  }

  @SubscribeMessage("banUser")
  async banUser(client: Socket, data: any) {
    console.log("ban user event");
    let channel = await this.channelService.findChannelById(data.channel.id);

    if (!channel) {
      this.server.to(client.id).emit("error", "channel not found");
      return;
    }
    data.channel = await this.restrictionService.ban(
      data.user,
      channel,
      data.date
    );
    const to = this.chatService.getUser(data.user.id);
    if (to) {
      this.server.to(to).emit("banned", data);
    }
    this.message(client, {
      content: `${data.user.username} has been banned from the channel`,
      channel: data.channel,
    });
  }

  @SubscribeMessage("muteUser")
  async muteUser(client: Socket, data: any) {
    console.log("mute user event");
    let channel = await this.channelService.findChannelById(data.channel.id);

    if (!channel) {
      this.server.to(client.id).emit("error", "channel not found");
      return;
    }
    data.channel = await this.restrictionService.mute(
      data.user,
      channel,
      data.date
    );
    const to = this.chatService.getUser(data.user.id);
    if (to) {
      this.server.to(to).emit("muted", data);
    }
    this.message(client, {
      content: `${data.user.username} has been muted`,
      channel: data.channel,
    });
  }

  @SubscribeMessage("setAdmin")
  async setAdmin(client: Socket, data: any) {
    console.log("setAdmin");
    let channel = await this.channelService.findChannelById(data.channel.id);

    if (!channel) {
      this.server.to(client.id).emit("error", "channel not found");
      return;
    }
    if (!this.channelService.findUserInChan(data.user.id, channel)) {
      this.server.to(client.id).emit("error", "user not found");
      return;
    }
    if (!channel.admins.find((admin) => admin.id === data.user.id)) {
      data.channel = await this.channelService.addUserChan(
        data.user,
        channel,
        "admins"
      );
      const to = this.chatService.getUser(data.user.id);
      if (to) this.server.to(to).emit("setAsAdmin", data);
      this.message(client, {
        content: `${data.user.username} has been set as admin`,
        channel: data.channel,
      });
    } else
      this.server
        .to(client.id)
        .emit("error", `user ${data.user.username} is already an admin`);
  }

  @SubscribeMessage("getConversation")
  async getConversation(client: Socket, data: any) {
    let conv = await this.messageService.getConversation(data.me, data.to);

    if (!conv) {
      conv = await this.messageService.createConversation(data.me, data.to);
      console.log("conv not found, creation new", conv);
    } else {
      conv = await this.messageService.updateNewMessages(conv, data.me.id);
      console.log("conv found", conv);
    }
    this.server.to(client.id).emit("openConversation", {
      id: conv.id,
      messages: conv.messages,
      to: data.to,
      show: true,
    });
  }

  @SubscribeMessage("directMessage")
  async directMessage(client: Socket, data: any) {
    let conv = await this.messageService.findConvById(data.convId);

    if (!conv) {
      this.server.to(client.id).emit("error", "error: conversation not found");
      return;
    }
    const msg = await this.messageService.createDm(data.user, data.content);
    conv = await this.messageService.pushDm(conv, msg);
    if (!(await this.usersService.checkBlocked(data.to.id, data.user.id))) {
      console.log("not blocked, sending dm");
      const to = this.chatService.getUser(data.to.id);
      if (to) {
        conv = await this.messageService.updateNewMessages(conv, data.to.id);
        this.server.to(to).emit("newDm", conv);
      }
    }
    this.server.to(client.id).emit("newDm", conv);
  }

  @SubscribeMessage("updateNewMessages")
  async updateNewMessages(client: Socket, data: any) {
    const conv = await this.messageService.findConvById(data.convId);

    await this.messageService.updateNewMessages(conv, data.userId);
  }
}
