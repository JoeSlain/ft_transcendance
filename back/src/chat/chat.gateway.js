"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.ChatGateway = void 0;
var websockets_1 = require("@nestjs/websockets");
var ChatGateway = /** @class */ (function () {
    function ChatGateway(usersService, chatService, notifService, channelService, messageService, restrictionService, gameService) {
        this.usersService = usersService;
        this.chatService = chatService;
        this.notifService = notifService;
        this.channelService = channelService;
        this.messageService = messageService;
        this.restrictionService = restrictionService;
        this.gameService = gameService;
    }
    ChatGateway.prototype.handleConnection = function (client) { };
    ChatGateway.prototype.handleDisconnect = function (client) { };
    /* LOGIN
    ** description: sauvegarde l'id du socket du client qui vient de s'authentifier
        via 42api et signale a tous les utilisateurs authentifies qu'un nouveau client
        vient de se connecter
    ** signal emis cote client: clientSocket.emit('login', user)
    ** reponse broadcast: 'updateStatus', {user, status}
    ** reponse client: 'loggedIn', {user} */
    ChatGateway.prototype.login = function (client, user) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                data = {
                    user: user,
                    status: "online"
                };
                console.log("chat ws login", user);
                if (this.gameService.getGameForUser(user.id))
                    data.status = "ingame";
                this.chatService.addUser(user.id, client.id, data.status);
                client.broadcast.emit("updateStatus", data);
                this.server.to(client.id).emit("loggedIn", user);
                return [2 /*return*/];
            });
        });
    };
    /* LOGOUT
    ** description: efface l'id du socket du client qui s'est logout et signale
        a tous les utilisateurs authentifies qu'un utilisateur vient de se deconnecter
    ** signal client: clientSocket.emit('logout', user)
    ** reponse broadcast: 'updateStatus', {user, status})
    ** reponse client: 'loggedOut', pas de params */
    ChatGateway.prototype.logout = function (client, user) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                data = {
                    user: user,
                    status: "offline"
                };
                console.log("chat ws logout");
                if (this.chatService.removeUser(user.id))
                    client.broadcast.emit("updateStatus", data);
                else
                    console.log("error logging out");
                this.server.to(client.id).emit("loggedOut");
                return [2 /*return*/];
            });
        });
    };
    ChatGateway.prototype.updateUser = function (client, user) {
        return __awaiter(this, void 0, void 0, function () {
            var status;
            return __generator(this, function (_a) {
                console.log("update user", user);
                status = this.chatService.getUserStatus(user.id);
                client.broadcast.emit("updateStatus", { user: user, status: status });
                client.broadcast.emit("updateConvs", user);
                client.broadcast.emit("updateSelectedChan", user);
                return [2 /*return*/];
            });
        });
    };
    ChatGateway.prototype.updateUserStatus = function (client, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.chatService.updateUserStatus(data.user.id, data.status);
                client.broadcast.emit("updateStatus", {
                    user: data.user,
                    status: data.status
                });
                return [2 /*return*/];
            });
        });
    };
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
    ChatGateway.prototype.getFriends = function (client, user) {
        return __awaiter(this, void 0, void 0, function () {
            var friends, map, ret;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.usersService.getFriends(user)];
                    case 1:
                        friends = _a.sent();
                        map = new Map();
                        friends.forEach(function (friend) {
                            var status = _this.chatService.getUserStatus(friend.id);
                            map.set(friend.id, status);
                        });
                        ret = {
                            friends: friends,
                            statuses: JSON.stringify(Array.from(map))
                        };
                        this.server.to(client.id).emit("friends", ret);
                        return [2 /*return*/];
                }
            });
        });
    };
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
    ChatGateway.prototype.notify = function (client, data) {
        return __awaiter(this, void 0, void 0, function () {
            var friend, notif, to;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("chat websocket invite");
                        if (data.from.id === data.to.id) {
                            this.server.to(client.id).emit("error", "invalid target");
                            return [2 /*return*/];
                        }
                        if (!(data.type === "Friend Request")) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.usersService.findFriend(data.from.id, data.to.id)];
                    case 1:
                        friend = _a.sent();
                        if (friend.length) {
                            this.server
                                .to(client.id)
                                .emit("error", "friend ".concat(data.to.username, " already added"));
                            return [2 /*return*/];
                        }
                        _a.label = 2;
                    case 2: return [4 /*yield*/, this.notifService.createNotif(data)];
                    case 3:
                        notif = _a.sent();
                        console.log("notif", notif);
                        if (notif) {
                            to = this.chatService.getUser(notif.to.id);
                            console.log("to", to);
                            if (to)
                                this.server.to(to).emit("notified", notif);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /* ACCEPT FRIEND
    ** description: ajoute les users from et to de la notif en amis dans la db,
        puis signale les users qu'ils sont devenus amis
    ** clientSocket.emit('acceptFriendRequest', notif)
    ** reponse user to: 'newFriend', {from}
    ** reponse user from: 'newFriend', {to}
    */
    ChatGateway.prototype.addFriend = function (client, notif) {
        return __awaiter(this, void 0, void 0, function () {
            var newFriend, toStatus, fromStatus, from;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("addFriend event");
                        return [4 /*yield*/, this.usersService.addFriend(notif.from, notif.to)];
                    case 1:
                        newFriend = _a.sent();
                        if (newFriend) {
                            toStatus = this.chatService.getUserStatus(notif.to.id);
                            fromStatus = this.chatService.getUserStatus(notif.from.id);
                            from = this.chatService.getUser(notif.from.id);
                            if (from) {
                                this.server
                                    .to(from)
                                    .emit("newFriend", { friend: notif.to, status: toStatus });
                            }
                            this.server
                                .to(client.id)
                                .emit("newFriend", { friend: notif.from, status: fromStatus });
                        }
                        else
                            console.log("error adding friend");
                        return [4 /*yield*/, this.notifService.deleteNotif(notif)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /* DECLINE FRIEND
    ** description: en cas de refus d'ajout en amis, on se contente de
        supprimer la notification de la database et on ne repond rien au client
    ** signal client: clientSocket.emit('declineFriendRequest', notif)
    **
    */
    ChatGateway.prototype.deleteNotif = function (client, notif) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("decline event");
                        return [4 /*yield*/, this.notifService.deleteNotif(notif)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /* DELETE FRIEND
    ** description: unfriend notif.from et notif.to dans la db et signale
        les users from et to qu'ils ne sont plus amis
    ** signal client: clientSocket.emit('deleteFriend', notif)
    ** reponse user to: 'friendDeleted', {notif.from}
    ** reponse user from: 'friendDeleted', {notif.to} */
    ChatGateway.prototype.deleteFriend = function (client, data) {
        return __awaiter(this, void 0, void 0, function () {
            var user1, user2, to;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("deleteFriend event");
                        return [4 /*yield*/, this.usersService.deleteFriend(data.user, data.friend)];
                    case 1:
                        user1 = _a.sent();
                        return [4 /*yield*/, this.usersService.deleteFriend(data.friend, data.user)];
                    case 2:
                        user2 = _a.sent();
                        if (user1 && user2) {
                            to = this.chatService.getUser(data.friend.id);
                            if (to)
                                this.server.to(to).emit("friendDeleted", data.user);
                            this.server.to(client.id).emit("friendDeleted", data.friend);
                        }
                        else
                            this.server.to(client.id).emit("error", "error deleting friend");
                        return [2 /*return*/];
                }
            });
        });
    };
    /* ACCEPT INVITE
    ** description: notifie les users notif.from et notif.to que l'utilisateur
        notif.to a accepte l'invitation a jouer. Le serveur renvoie aux utilisateurs
        l'id de l'utilisateur qui a emis l'invitation a jouer. Cet id peut alors etre
        utilise cote client pour emettre une nouvelle requete pour rejoindre la gameRoom
        dont l'id est notif.from.id
    ** signal client: clientSocket.emit('acceptInvite', notif)
    ** reponse user from: 'acceptedInvite', notif.from.id
    ** reponse user to: 'acceptedInvite', notif.from.id */
    ChatGateway.prototype.acceptInvite = function (client, notif) {
        return __awaiter(this, void 0, void 0, function () {
            var from;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        from = this.chatService.getUser(notif.from.id);
                        if (from) {
                            this.server.to(from).emit("acceptedInvite", notif.from.id);
                            this.server.to(client.id).emit("acceptedInvite", notif.from.id);
                        }
                        else
                            this.server
                                .to(client.id)
                                .emit("error", "error: this invitation has expired");
                        return [4 /*yield*/, this.notifService.deleteNotif(notif)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ChatGateway.prototype.getChannels = function (client, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var privateChans, publicChans;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.channelService.getPrivateChannels(userId)];
                    case 1:
                        privateChans = _a.sent();
                        return [4 /*yield*/, this.channelService.getPublicChannels()];
                    case 2:
                        publicChans = _a.sent();
                        this.server.to(client.id).emit("channels", { privateChans: privateChans, publicChans: publicChans });
                        return [2 /*return*/];
                }
            });
        });
    };
    ChatGateway.prototype.createChannel = function (client, chanData) {
        return __awaiter(this, void 0, void 0, function () {
            var error, channel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("create channel");
                        return [4 /*yield*/, this.channelService.checkChanData(chanData)];
                    case 1:
                        error = _a.sent();
                        if (!error) return [3 /*break*/, 2];
                        this.server.to(client.id).emit("error", error);
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.channelService.createChannel(chanData)];
                    case 3:
                        channel = _a.sent();
                        //console.log("returned channel", channel);
                        if (!channel)
                            this.server.to(client.id).emit("error", "invalid chan name");
                        else {
                            if (channel.type !== "private")
                                this.server.emit("newChannel", channel);
                            else
                                this.server.to(client.id).emit("newChannel", channel);
                            client.join(channel.socketId);
                        }
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ChatGateway.prototype.checkChanPassword = function (client, data) {
        return __awaiter(this, void 0, void 0, function () {
            var channel, check;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.channelService.findChannelById(data.channel.id)];
                    case 1:
                        channel = _a.sent();
                        if (!channel) {
                            this.server.to(client.id).emit("error", "channel not found");
                            return [2 /*return*/, false];
                        }
                        if (!(channel.type === "protected")) return [3 /*break*/, 4];
                        check = false;
                        if (!data.channel.password) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.channelService.checkChanPassword(data.channel.password, channel.password)];
                    case 2:
                        check = _a.sent();
                        _a.label = 3;
                    case 3:
                        if (!check) {
                            this.server.to(client.id).emit("wrongPassword");
                            return [2 /*return*/, false];
                        }
                        _a.label = 4;
                    case 4: return [2 /*return*/, true];
                }
            });
        });
    };
    ChatGateway.prototype.joinChannel = function (client, data) {
        return __awaiter(this, void 0, void 0, function () {
            var channel, ban;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.channelService.findChannelById(data.channel.id)];
                    case 1:
                        channel = _a.sent();
                        return [4 /*yield*/, this.restrictionService.isBanned(data.user.id, channel)];
                    case 2:
                        if (!_a.sent()) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.restrictionService.getBanned(data.user.id, channel)];
                    case 3:
                        ban = _a.sent();
                        this.server
                            .to(client.id)
                            .emit("error", "You cannot join this channel because you have been banned until ".concat(ban.end));
                        return [2 /*return*/];
                    case 4: return [4 /*yield*/, this.checkChanPassword(client, data)];
                    case 5:
                        if (!(_a.sent()))
                            return [2 /*return*/];
                        if (!!this.channelService.findUserInChan(data.user.id, channel)) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.channelService.addUserChan(data.user, channel, "users")];
                    case 6:
                        channel = _a.sent();
                        if (!!channel.owner) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.channelService.setChanOwner(data.user, channel)];
                    case 7:
                        channel = _a.sent();
                        _a.label = 8;
                    case 8:
                        data.channel = __assign(__assign({}, channel), { password: null });
                        client.join(data.channel.socketId);
                        client.to(data.channel.socketId).emit("updateChannel", data.channel);
                        this.server.to(client.id).emit("joinedChannel", data.channel);
                        return [2 /*return*/, data.channel];
                }
            });
        });
    };
    ChatGateway.prototype.deleteChannel = function (client, data) {
        return __awaiter(this, void 0, void 0, function () {
            var channel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("delete channel");
                        return [4 /*yield*/, this.channelService.leaveChan(data.user, data.channel)];
                    case 1:
                        channel = _a.sent();
                        //console.log("postleave", data.channel);
                        if (!channel)
                            this.server.emit("removeChannel", data.channel);
                        else
                            this.server.to(client.id).emit("removeChannel", data.channel);
                        if (channel)
                            this.server.to(data.channel.socketId).emit("leftChannel", channel);
                        client.leave(data.channel.socketId);
                        return [2 /*return*/];
                }
            });
        });
    };
    ChatGateway.prototype.leaveChannel = function (client, data) {
        return __awaiter(this, void 0, void 0, function () {
            var channel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("leave channel");
                        return [4 /*yield*/, this.channelService.leaveChan(data.user, data.channel)];
                    case 1:
                        channel = _a.sent();
                        //console.log("postleave", data.channel);
                        if (!channel)
                            this.server.to(data.channel.socketId).emit("removeChannel", data.channel);
                        else
                            this.server.to(channel.socketId).emit("leftChannel", channel);
                        this.server.to(client.id).emit("leftChannel", channel);
                        client.leave(data.channel.socketId);
                        return [2 /*return*/];
                }
            });
        });
    };
    ChatGateway.prototype.chanInvite = function (client, data) {
        return __awaiter(this, void 0, void 0, function () {
            var to, notif;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("chan invite");
                        if (this.channelService.findUserInChan(data.to.id, data.channel)) {
                            this.server.to(client.id).emit("error", "user already in chan");
                            return [2 /*return*/];
                        }
                        to = this.chatService.getUser(data.to.id);
                        return [4 /*yield*/, this.notifService.createNotif(data)];
                    case 1:
                        notif = _a.sent();
                        console.log("notif", notif);
                        if (notif && to) {
                            this.server.to(to).emit("notified", notif);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ChatGateway.prototype.acceptChanInvite = function (client, notif) {
        return __awaiter(this, void 0, void 0, function () {
            var channel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.notifService.deleteNotif(notif)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.joinChannel(client, {
                                user: notif.to,
                                channel: notif.channel
                            })];
                    case 2:
                        channel = _a.sent();
                        if (channel)
                            this.server.to(client.id).emit("newChannel", channel);
                        return [2 /*return*/];
                }
            });
        });
    };
    ChatGateway.prototype.message = function (client, data) {
        return __awaiter(this, void 0, void 0, function () {
            var channel, _a, mute, message;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log("new message");
                        return [4 /*yield*/, this.channelService.findChannelById(data.channel.id)];
                    case 1:
                        channel = _b.sent();
                        if (!channel) {
                            this.server.to(client.id).emit("error", "channel not found");
                            return [2 /*return*/];
                        }
                        _a = data.from;
                        if (!_a) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.restrictionService.isMuted(data.from.id, channel)];
                    case 2:
                        _a = (_b.sent());
                        _b.label = 3;
                    case 3:
                        if (!_a) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.restrictionService.getMuted(data.from.id, channel)];
                    case 4:
                        mute = _b.sent();
                        this.server
                            .to(client.id)
                            .emit("error", "You cannot write in this channel because you have been muted until ".concat(mute.end));
                        return [2 /*return*/];
                    case 5:
                        console.log("creating msg");
                        return [4 /*yield*/, this.messageService.createChanMessage({
                                content: data.content,
                                from: data.from,
                                channel: channel
                            })];
                    case 6:
                        message = _b.sent();
                        //console.log("ret msg", message);
                        console.log("returning new msg");
                        if (!message)
                            this.server.to(client.id).emit("error", "error creating message");
                        else
                            this.server.to(data.channel.socketId).emit("newMessage", message);
                        return [2 /*return*/];
                }
            });
        });
    };
    ChatGateway.prototype.setChannelPassword = function (client, data) {
        return __awaiter(this, void 0, void 0, function () {
            var channel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.checkChanPassword(client, data))
                            return [2 /*return*/];
                        return [4 /*yield*/, this.channelService.setChanPassword(data.channel, data.newPassword)];
                    case 1:
                        channel = _a.sent();
                        if (data.channel.type === "public") {
                            channel.password = null;
                            this.server.emit("updateChannel", channel);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ChatGateway.prototype.removeChannelPassword = function (client, channel) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.checkChanPassword(client, { channel: channel })];
                    case 1:
                        if (!(_a.sent()))
                            return [2 /*return*/];
                        return [4 /*yield*/, this.channelService.findChannelById(channel.id)];
                    case 2:
                        channel = _a.sent();
                        return [4 /*yield*/, this.channelService.removeChanPassword(channel)];
                    case 3:
                        channel = _a.sent();
                        this.server.emit("updateChannel", channel);
                        return [2 /*return*/];
                }
            });
        });
    };
    ChatGateway.prototype.banUser = function (client, data) {
        return __awaiter(this, void 0, void 0, function () {
            var channel, _a, to;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log("ban user event");
                        return [4 /*yield*/, this.channelService.findChannelById(data.channel.id)];
                    case 1:
                        channel = _b.sent();
                        if (!channel) {
                            this.server.to(client.id).emit("error", "channel not found");
                            return [2 /*return*/];
                        }
                        _a = data;
                        return [4 /*yield*/, this.restrictionService.ban(data.user, channel, data.date)];
                    case 2:
                        _a.channel = _b.sent();
                        to = this.chatService.getUser(data.user.id);
                        if (to) {
                            this.server.to(to).emit("banned", data);
                        }
                        this.message(client, {
                            content: "".concat(data.user.username, " has been banned from the channel"),
                            channel: data.channel
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    ChatGateway.prototype.muteUser = function (client, data) {
        return __awaiter(this, void 0, void 0, function () {
            var channel, _a, to;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log("mute user event");
                        return [4 /*yield*/, this.channelService.findChannelById(data.channel.id)];
                    case 1:
                        channel = _b.sent();
                        if (!channel) {
                            this.server.to(client.id).emit("error", "channel not found");
                            return [2 /*return*/];
                        }
                        _a = data;
                        return [4 /*yield*/, this.restrictionService.mute(data.user, channel, data.date)];
                    case 2:
                        _a.channel = _b.sent();
                        to = this.chatService.getUser(data.user.id);
                        if (to) {
                            this.server.to(to).emit("muted", data);
                        }
                        this.message(client, {
                            content: "".concat(data.user.username, " has been muted"),
                            channel: data.channel
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    ChatGateway.prototype.setAdmin = function (client, data) {
        return __awaiter(this, void 0, void 0, function () {
            var channel, _a, to;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log("setAdmin");
                        return [4 /*yield*/, this.channelService.findChannelById(data.channel.id)];
                    case 1:
                        channel = _b.sent();
                        if (!channel) {
                            this.server.to(client.id).emit("error", "channel not found");
                            return [2 /*return*/];
                        }
                        if (!this.channelService.findUserInChan(data.user.id, channel)) {
                            this.server.to(client.id).emit("error", "user not found");
                            return [2 /*return*/];
                        }
                        if (!!channel.admins.find(function (admin) { return admin.id === data.user.id; })) return [3 /*break*/, 3];
                        _a = data;
                        return [4 /*yield*/, this.channelService.addUserChan(data.user, channel, "admins")];
                    case 2:
                        _a.channel = _b.sent();
                        to = this.chatService.getUser(data.user.id);
                        if (to)
                            this.server.to(to).emit("setAsAdmin", data);
                        this.message(client, {
                            content: "".concat(data.user.username, " has been set as admin"),
                            channel: data.channel
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        this.server
                            .to(client.id)
                            .emit("error", "user ".concat(data.user.username, " is already an admin"));
                        _b.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ChatGateway.prototype.getConversation = function (client, data) {
        return __awaiter(this, void 0, void 0, function () {
            var conv;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.messageService.getConversation(data.me, data.to)];
                    case 1:
                        conv = _a.sent();
                        if (!!conv) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.messageService.createConversation(data.me, data.to)];
                    case 2:
                        conv = _a.sent();
                        console.log("conv not found, creation new", conv);
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.messageService.updateNewMessages(conv, data.me.id)];
                    case 4:
                        conv = _a.sent();
                        console.log("conv found", conv);
                        _a.label = 5;
                    case 5:
                        this.server.to(client.id).emit("openConversation", {
                            id: conv.id,
                            messages: conv.messages,
                            to: data.to,
                            show: true
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    ChatGateway.prototype.directMessage = function (client, data) {
        return __awaiter(this, void 0, void 0, function () {
            var conv, msg, to;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.messageService.findConvById(data.convId)];
                    case 1:
                        conv = _a.sent();
                        if (!conv) {
                            this.server.to(client.id).emit("error", "error: conversation not found");
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.messageService.createDm(data.user, data.content)];
                    case 2:
                        msg = _a.sent();
                        return [4 /*yield*/, this.messageService.pushDm(conv, msg)];
                    case 3:
                        conv = _a.sent();
                        return [4 /*yield*/, this.usersService.checkBlocked(data.user.id, data.to.id)];
                    case 4:
                        if (!!(_a.sent())) return [3 /*break*/, 6];
                        console.log("not blocked, sending dm");
                        to = this.chatService.getUser(data.to.id);
                        if (!to) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.messageService.updateNewMessages(conv, data.to.id)];
                    case 5:
                        conv = _a.sent();
                        this.server.to(to).emit("newDm", conv);
                        _a.label = 6;
                    case 6:
                        this.server.to(client.id).emit("newDm", conv);
                        return [2 /*return*/];
                }
            });
        });
    };
    ChatGateway.prototype.updateNewMessages = function (client, data) {
        return __awaiter(this, void 0, void 0, function () {
            var conv;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.messageService.findConvById(data.convId)];
                    case 1:
                        conv = _a.sent();
                        return [4 /*yield*/, this.messageService.updateNewMessages(conv, data.userId)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        (0, websockets_1.WebSocketServer)()
    ], ChatGateway.prototype, "server");
    __decorate([
        (0, websockets_1.SubscribeMessage)("login")
    ], ChatGateway.prototype, "login");
    __decorate([
        (0, websockets_1.SubscribeMessage)("logout")
    ], ChatGateway.prototype, "logout");
    __decorate([
        (0, websockets_1.SubscribeMessage)("updateUser")
    ], ChatGateway.prototype, "updateUser");
    __decorate([
        (0, websockets_1.SubscribeMessage)("updateUserStatus")
    ], ChatGateway.prototype, "updateUserStatus");
    __decorate([
        (0, websockets_1.SubscribeMessage)("getFriends")
    ], ChatGateway.prototype, "getFriends");
    __decorate([
        (0, websockets_1.SubscribeMessage)("notif")
    ], ChatGateway.prototype, "notify");
    __decorate([
        (0, websockets_1.SubscribeMessage)("acceptFriendRequest")
    ], ChatGateway.prototype, "addFriend");
    __decorate([
        (0, websockets_1.SubscribeMessage)("deleteNotif")
    ], ChatGateway.prototype, "deleteNotif");
    __decorate([
        (0, websockets_1.SubscribeMessage)("deleteFriend")
    ], ChatGateway.prototype, "deleteFriend");
    __decorate([
        (0, websockets_1.SubscribeMessage)("acceptGameInvite")
    ], ChatGateway.prototype, "acceptInvite");
    __decorate([
        (0, websockets_1.SubscribeMessage)("getChannels")
    ], ChatGateway.prototype, "getChannels");
    __decorate([
        (0, websockets_1.SubscribeMessage)("createChannel")
    ], ChatGateway.prototype, "createChannel");
    __decorate([
        (0, websockets_1.SubscribeMessage)("joinChannel")
    ], ChatGateway.prototype, "joinChannel");
    __decorate([
        (0, websockets_1.SubscribeMessage)("deleteChannel")
    ], ChatGateway.prototype, "deleteChannel");
    __decorate([
        (0, websockets_1.SubscribeMessage)("leaveChannel")
    ], ChatGateway.prototype, "leaveChannel");
    __decorate([
        (0, websockets_1.SubscribeMessage)("chanInvite")
    ], ChatGateway.prototype, "chanInvite");
    __decorate([
        (0, websockets_1.SubscribeMessage)("acceptChannelInvite")
    ], ChatGateway.prototype, "acceptChanInvite");
    __decorate([
        (0, websockets_1.SubscribeMessage)("chanMessage")
    ], ChatGateway.prototype, "message");
    __decorate([
        (0, websockets_1.SubscribeMessage)("setChannelPassword")
    ], ChatGateway.prototype, "setChannelPassword");
    __decorate([
        (0, websockets_1.SubscribeMessage)("removeChannelPassword")
    ], ChatGateway.prototype, "removeChannelPassword");
    __decorate([
        (0, websockets_1.SubscribeMessage)("banUser")
    ], ChatGateway.prototype, "banUser");
    __decorate([
        (0, websockets_1.SubscribeMessage)("muteUser")
    ], ChatGateway.prototype, "muteUser");
    __decorate([
        (0, websockets_1.SubscribeMessage)("setAdmin")
    ], ChatGateway.prototype, "setAdmin");
    __decorate([
        (0, websockets_1.SubscribeMessage)("getConversation")
    ], ChatGateway.prototype, "getConversation");
    __decorate([
        (0, websockets_1.SubscribeMessage)("directMessage")
    ], ChatGateway.prototype, "directMessage");
    __decorate([
        (0, websockets_1.SubscribeMessage)("updateNewMessages")
    ], ChatGateway.prototype, "updateNewMessages");
    ChatGateway = __decorate([
        (0, websockets_1.WebSocketGateway)(3002, {
            cors: {
                origin: "http://localhost:3000"
            },
            namespace: "chat"
        })
    ], ChatGateway);
    return ChatGateway;
}());
exports.ChatGateway = ChatGateway;
