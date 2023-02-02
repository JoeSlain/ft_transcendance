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
exports.GameGateway = void 0;
var websockets_1 = require("@nestjs/websockets");
var GameGateway = /** @class */ (function () {
    function GameGateway(roomService, gameService, queueService) {
        this.roomService = roomService;
        this.gameService = gameService;
        this.queueService = queueService;
    }
    GameGateway.prototype.login = function (client, user) {
        this.getRoom(client, user);
    };
    GameGateway.prototype.logout = function (client, user) {
        var room = this.roomService.getUserRoom(user.id);
        if (room && !room.gameStarted) {
            var roomLeft = this.roomService.leaveRoom(room.id, user.id);
            client.to(room.id).emit("leftRoom", roomLeft);
            client.leave(room.id);
        }
        this.queueService.stopQueue(user.id);
    };
    // ROOM
    GameGateway.prototype.getRoom = function (client, user) {
        var room = this.roomService.getUserRoom(user.id);
        if (!room) {
            room = this.roomService.createRoom(user);
            this.roomService.usersRooms.set(user.id, room);
        }
        client.join(room.id);
        this.server.to(client.id).emit("newRoom", room);
    };
    GameGateway.prototype.joinRoom = function (client, data) {
        console.log("join event");
        var room = this.roomService.getUserRoom(data.id);
        // check room
        if (!room) {
            this.server.to(client.id).emit("error", "game room not found");
            return null;
        }
        // leave previous room
        var prevRoom = this.roomService.getUserRoom(data.user.id);
        if (prevRoom) {
            if (prevRoom.id !== room.id && !prevRoom.gameStarted)
                this.leaveRoom(client, { roomId: prevRoom.id, user: data.user });
            else
                return;
        }
        // add user to room
        room = this.roomService.joinRoom(data.user, room);
        this.roomService.usersRooms.set(data.user.id, room);
        client.join(room.id);
        this.server.to(room.id).emit("joinedRoom", room);
    };
    GameGateway.prototype.join = function (client, roomId) {
        client.join(roomId);
    };
    GameGateway.prototype.leaveRoom = function (client, data) {
        console.log("leave room event");
        var room = this.roomService.leaveRoom(data.roomId, data.user.id);
        console.log("client ".concat(data.user.id, " left room ").concat(data.roomId));
        client.to(data.roomId).emit("leftRoom", room);
        client.leave(data.roomId);
        this.getRoom(client, data.user);
    };
    GameGateway.prototype.spectate = function (client, data) {
        console.log("spectatate event");
        var room = this.roomService.usersRooms.get(data.user.id);
        // check room
        if (!room) {
            this.server
                .to(client.id)
                .emit("error", " ".concat(data.user.username, " is not currently in a game"));
            return;
        }
        // leave previous room
        var prevRoom = this.roomService.getUserRoom(data.me.id);
        if (prevRoom) {
            if (this.gameService.getGameForUser(data.me.id) ||
                prevRoom.id === room.id)
                return;
            this.leaveRoom(client, { roomId: prevRoom.id, user: data.me });
        }
        // add spectator to room
        room = this.roomService.addSpectator(data.me, room);
        this.roomService.rooms.set(room.id, room);
        this.roomService.usersRooms.set(data.me.id, room);
        client.join(room.id);
        this.server.to(room.id).emit("joinedRoom", room);
    };
    GameGateway.prototype.setReady = function (client, data) {
        console.log("setReady event");
        data.room = this.roomService.setReady(data.roomId, data.userId);
        this.server.to(data.roomId).emit("ready", data.room);
    };
    /*@SubscribeMessage("eloUpdated")
    updateRoom(client: Socket, user: User) {
      const room = this.roomService.getUserRoom(user.id);
  
      if (!room) return;
      if (room.host.infos.id === user.id) room.host.infos = user;
      else if (room.guest.infos.id === user.id) room.guest.infos = user;
      this.roomService.updateRoom(room.id, room);
  
      this.server.to(room.id).emit("updateRoom", room);
    }*/
    // GAME
    GameGateway.prototype.createGame = function (client, data) {
        console.log("create game event");
        var game = this.gameService.createGame(data.room, data.powerUps);
        // room.gameStarted to true
        data.room = this.roomService.updateRoom(data.room.id, __assign(__assign({}, data.room), { gameStarted: true }));
        // send new game to ongoing games
        this.server.emit("addGame", {
            id: game.gameId,
            player1: game.player1.infos,
            player2: game.player2.infos,
            score: "0/0"
        });
        // signal clients that game started
        this.server.to(data.room.id).emit("gameStarted", data.room);
        this.server.to(data.room.id).emit("updateStatus", "ingame");
        // start mainloop
        this.startGame(client, game);
    };
    GameGateway.prototype.getGame = function (client, userId) {
        var game = this.gameService.getGameForUser(userId);
        if (game)
            this.server.to(client.id).emit("newGame", game);
    };
    GameGateway.prototype.getCurrentGames = function (client, data) {
        var games = this.gameService.getCurrentGames();
        if (games)
            this.server.to(client.id).emit("newGames", games);
    };
    GameGateway.prototype.endGame = function (game) {
        return __awaiter(this, void 0, void 0, function () {
            var room, gameInfos;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        room = this.roomService.findRoom(game.gameId);
                        return [4 /*yield*/, this.gameService.register(game)];
                    case 1:
                        gameInfos = _a.sent();
                        return [4 /*yield*/, this.gameService.updateRoom(room, gameInfos)];
                    case 2:
                        // room game started to false
                        //this.roomService.updateRoom(room.id, { ...room, gameStarted: false });
                        // delete game + update users
                        room = _a.sent();
                        this.server.to(room.id).emit("endGame", room);
                        this.server.to(room.id).emit("updateStatus", "online");
                        this.server
                            .to(room.id)
                            .emit("updateElo", { host: room.host.infos, guest: room.guest.infos });
                        this.server.emit("deleteGame", game);
                        this.gameService.deleteGame(game);
                        return [2 /*return*/];
                }
            });
        });
    };
    GameGateway.prototype.startGame = function (client, game) {
        var _this = this;
        //let n = 0;
        var gameLoop = setInterval(function () {
            /*n++;
            if (n % 60 === 0) {
              console.log(`interval ${n}`)
            }*/
            game = _this.gameService.games.get(game.gameId);
            // Vérification de la fin de la partie
            if (game.player1.score >= 10) {
                clearInterval(gameLoop);
                game.player1.win = true;
                game.gameRunning = false;
            }
            else if (game.player2.score >= 10) {
                clearInterval(gameLoop);
                game.player2.win = true;
                game.gameRunning = false;
            }
            else {
                game = _this.gameService.updateBall(game);
                if (game.powerUps) {
                    game = _this.gameService.spawnPowerUp(game);
                    game = _this.gameService.updatePowerUp(game);
                }
                _this.gameService.saveGame(game);
            }
            // score update
            if (game.scoreUpdate) {
                game.scoreUpdate = false;
                _this.server.emit("updateGames", game);
            }
            // signals
            _this.server.to(game.gameId).emit("updateGameState", game);
            if (!game.gameRunning) {
                //clearInterval(gameLoop);
                _this.endGame(game);
                return;
            }
        }, 1000 / 60);
        console.log("out game loop");
    };
    /*@SubscribeMessage("giveUp")
    giveUp(client: Socket, data: any) {
      console.log("giveUp");
      data.game.gameRunning = false;
      this.gameService.saveGame(data.game);
      this.server.to(data.game.gameId).emit("forfeit", data);
    }*/
    GameGateway.prototype.rematch = function (client, game) {
        game = this.gameService.resetGame(game);
        this.server.to(game.gameId).emit("gameReset", game);
        this.startGame(client, game);
    };
    GameGateway.prototype.movePaddle = function (client, data) {
        var game = this.gameService.movePaddle(data.game, data.playerId, data.direction);
        this.server.to(game.gameId).emit("updatePaddle", game);
    };
    GameGateway.prototype.stopPaddle = function (client, data) {
        /*if (data.playerId === 1) {
          data.game.player1.paddle.up = false;
          data.game.player1.paddle.down = false;
        } else if (data.playerId === 2) {
          data.game.player2.paddle.up = false;
          data.game.player2.paddle.down = false;
        }
        this.gameService.saveGame(data.game);*/
    };
    // QUEUE
    GameGateway.prototype.emitOpponent = function (client, user, opponent) {
        console.log("emit stop queue");
        var room = this.roomService.getUserRoom(opponent.id);
        // stop queue
        this.server.to(room.id).emit("stopQueue");
        this.server.to(client.id).emit("stopQueue");
        if (!opponent) {
            console.log("opponent null, returning");
            return;
        }
        // join room
        console.log("user ".concat(user.username, " joining room ").concat(room.id));
        this.joinRoom(client, { user: user, id: opponent.id });
    };
    GameGateway.prototype.searchOpponent = function (client, user) {
        var _this = this;
        console.log("search opponent event");
        var eloRange = 50;
        var n = 0;
        var opponent = this.queueService.findOpponent(user.id, user.elo, eloRange);
        // find opponent
        if (opponent) {
            console.log("opponent found ".concat(opponent.username));
            this.emitOpponent(client, user, opponent);
            return;
        }
        // queue up
        console.log("opponent not found, queueing user ".concat(user.username));
        var index = this.queueService.queueUp(user);
        var interval = setInterval(function () {
            console.log("interval userId: ".concat(user.id, ", id: ").concat(interval));
            console.log("loop counter : ".concat(n));
            n++;
            eloRange += 50;
            if (!_this.queueService.checkQueued(index, user.id)) {
                console.log("user ".concat(user.username, " not queued, exiting"));
                //clearInterval(interval);
                //this.emitOpponent(client, user, opponent);
                return;
            }
            opponent = _this.queueService.findOpponent(user.id, user.elo, eloRange);
            if (opponent) {
                console.log("opponent found ".concat(opponent.username));
                //this.queueService.queue.splice(index, 1);
                //clearInterval(interval);
                _this.queueService.stopQueue(user.id, index);
                _this.emitOpponent(client, user, opponent);
                return;
            }
        }, 10000);
        this.queueService.addInterval(user.id, interval);
        console.log("out interval");
    };
    GameGateway.prototype.stopQueue = function (client, user) {
        console.log("stopQueue");
        this.queueService.stopQueue(user.id);
    };
    __decorate([
        (0, websockets_1.WebSocketServer)()
    ], GameGateway.prototype, "server");
    __decorate([
        (0, websockets_1.SubscribeMessage)("login")
    ], GameGateway.prototype, "login");
    __decorate([
        (0, websockets_1.SubscribeMessage)("logout")
    ], GameGateway.prototype, "logout");
    __decorate([
        (0, websockets_1.SubscribeMessage)("getRoom")
    ], GameGateway.prototype, "getRoom");
    __decorate([
        (0, websockets_1.SubscribeMessage)("joinRoom")
    ], GameGateway.prototype, "joinRoom");
    __decorate([
        (0, websockets_1.SubscribeMessage)("join")
    ], GameGateway.prototype, "join");
    __decorate([
        (0, websockets_1.SubscribeMessage)("leaveRoom")
    ], GameGateway.prototype, "leaveRoom");
    __decorate([
        (0, websockets_1.SubscribeMessage)("spectate")
    ], GameGateway.prototype, "spectate");
    __decorate([
        (0, websockets_1.SubscribeMessage)("setReady")
    ], GameGateway.prototype, "setReady");
    __decorate([
        (0, websockets_1.SubscribeMessage)("createGame")
    ], GameGateway.prototype, "createGame");
    __decorate([
        (0, websockets_1.SubscribeMessage)("getGame")
    ], GameGateway.prototype, "getGame");
    __decorate([
        (0, websockets_1.SubscribeMessage)("getCurrentGames")
    ], GameGateway.prototype, "getCurrentGames");
    __decorate([
        (0, websockets_1.SubscribeMessage)("startGame")
    ], GameGateway.prototype, "startGame");
    __decorate([
        (0, websockets_1.SubscribeMessage)("rematch")
    ], GameGateway.prototype, "rematch");
    __decorate([
        (0, websockets_1.SubscribeMessage)("movePaddle")
    ], GameGateway.prototype, "movePaddle");
    __decorate([
        (0, websockets_1.SubscribeMessage)("stopPaddle")
    ], GameGateway.prototype, "stopPaddle");
    __decorate([
        (0, websockets_1.SubscribeMessage)("searchOpponent")
    ], GameGateway.prototype, "searchOpponent");
    __decorate([
        (0, websockets_1.SubscribeMessage)("stopQueue")
    ], GameGateway.prototype, "stopQueue");
    GameGateway = __decorate([
        (0, websockets_1.WebSocketGateway)(3003, {
            cors: {
                origin: "http://localhost:3000"
            },
            namespace: "game"
        })
    ], GameGateway);
    return GameGateway;
}());
exports.GameGateway = GameGateway;
