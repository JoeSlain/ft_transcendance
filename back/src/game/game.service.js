"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
exports.GameService = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var database_1 = require("../database");
var GameService = /** @class */ (function () {
    function GameService(gameRepo, userRepo, roomService) {
        this.gameRepo = gameRepo;
        this.userRepo = userRepo;
        this.roomService = roomService;
        this.users = new Map();
        this.games = new Map();
    }
    // I. MAP
    GameService.prototype.newPlayer = function (width, height, id) {
        var player = {
            x: id === 1 ? 30 : width - 50,
            y: height / 2 - 30,
            width: 20,
            height: 60,
            score: 0,
            win: false,
            paddle: null,
            infos: null
        };
        player.paddle = {
            left: player.x,
            right: player.x + player.width,
            top: player.y + player.height,
            bottom: player.y,
            up: false,
            down: false
        };
        return player;
    };
    GameService.prototype.newBall = function (width, height, dir) {
        var ball = {
            x: width / 2 - 5,
            y: height / 2 - 5,
            speedX: dir * 5,
            speedY: (Math.random() * 2 - 1) * 5,
            radius: 10
        };
        return ball;
    };
    GameService.prototype.createGame = function (room, powerUps) {
        var width = 800; // largeur de la zone de jeu
        var height = 600; // hauteur de la zone de jeu
        var gameId = room.id;
        var player1 = this.newPlayer(width, height, 1);
        player1.infos = room.host.infos;
        var player2 = this.newPlayer(width, height, 2);
        player2.infos = room.guest.infos;
        var ball = this.newBall(width, height, 1);
        var game = {
            width: width,
            height: height,
            player1: player1,
            player2: player2,
            ball: ball,
            gameRunning: true,
            scoreUpdate: false,
            gameId: gameId,
            powerUps: powerUps,
            grid: []
        };
        this.saveGame(game);
        return game;
    };
    GameService.prototype.getGameForUser = function (id) {
        return this.users.get(id);
    };
    GameService.prototype.saveGame = function (game) {
        this.games.set(game.gameId, game);
        this.users.set(game.player1.infos.id, game);
        this.users.set(game.player2.infos.id, game);
    };
    GameService.prototype.deleteGame = function (game) {
        this.games["delete"](game.gameId);
        this.users["delete"](game.player1.infos.id);
        this.users["delete"](game.player2.infos.id);
    };
    GameService.prototype.resetGame = function (game) {
        var user1 = game.player1.infos;
        var user2 = game.player2.infos;
        game.ball = this.newBall(game.width, game.height, 1);
        game.player1 = this.newPlayer(game.width, game.height, 1);
        game.player1.infos = user1;
        game.player2 = this.newPlayer(game.width, game.height, 2);
        game.player1.infos = user2;
        game.gameRunning = true;
        this.saveGame(game);
        return game;
    };
    // II. GAME UTILS
    GameService.prototype.getCurrentGames = function () {
        var games = [];
        var iter = this.games.values();
        while (iter) {
            var current = iter.next().value;
            if (!current)
                return games;
            games.push({
                id: current.gameId,
                player1: current.player1.infos,
                player2: current.player2.infos,
                score: "".concat(current.player1.score, "/").concat(current.player2.score)
            });
        }
        return games;
    };
    GameService.prototype.register = function (game) {
        return __awaiter(this, void 0, void 0, function () {
            var newGame;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        newGame = this.gameRepo.create({
                            user1: game.player1.infos,
                            user2: game.player2.infos,
                            winnerId: game.player1.win
                                ? game.player1.infos.id
                                : game.player2.infos.id,
                            score1: game.player1.score,
                            score2: game.player2.score,
                            date: new Date().toISOString().slice(0, 10)
                        });
                        return [4 /*yield*/, this.gameRepo.save(newGame)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    GameService.prototype.updateUsersElo = function (gameInfos) {
        return __awaiter(this, void 0, void 0, function () {
            var winner, loser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // set winner/loser
                        if (gameInfos.user1.id === gameInfos.winnerId) {
                            winner = gameInfos.user1;
                            loser = gameInfos.user2;
                        }
                        else {
                            winner = gameInfos.user2;
                            loser = gameInfos.user1;
                        }
                        // update stats
                        if (winner.elo > loser.elo) {
                            winner.elo += 1;
                            loser.elo -= 1;
                        }
                        else if (winner.elo === loser.elo) {
                            winner.elo += 10;
                            loser.elo -= 10;
                        }
                        else {
                            winner.elo += 20;
                            loser.elo -= 20;
                        }
                        winner.n_win++;
                        loser.n_lose++;
                        return [4 /*yield*/, this.userRepo.save(winner)];
                    case 1:
                        // save stats
                        winner = _a.sent();
                        return [4 /*yield*/, this.userRepo.save(loser)];
                    case 2:
                        loser = _a.sent();
                        return [2 /*return*/, { winner: winner, loser: loser }];
                }
            });
        });
    };
    GameService.prototype.updateRoom = function (room, gameInfos) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, winner, loser;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.updateUsersElo(gameInfos)];
                    case 1:
                        _a = _b.sent(), winner = _a.winner, loser = _a.loser;
                        if (winner.id === room.host.infos.id) {
                            room.host.infos = winner;
                            room.guest.infos = loser;
                        }
                        else {
                            room.host.infos = loser;
                            room.guest.infos = winner;
                        }
                        room.gameStarted = false;
                        room.host.ready = false;
                        room.guest.ready = false;
                        this.roomService.updateRoom(room.id, room);
                        return [2 /*return*/, room];
                }
            });
        });
    };
    // III. GAME MECHANICS
    GameService.prototype.startGame = function (game) {
        game.gameRunning = true;
    };
    GameService.prototype.stopGame = function (game) {
        game.gameRunning = false;
    };
    GameService.prototype.player1Collision = function (game) {
        if (game.ball.x <= game.player1.x + game.player1.width &&
            game.ball.x > game.player1.x &&
            game.ball.y >= game.player1.y &&
            game.ball.y <= game.player1.y + game.player1.height)
            return true;
        return false;
    };
    GameService.prototype.player2Collision = function (game) {
        if (game.ball.x + 10 >= game.player2.x &&
            game.ball.x < game.player2.x + game.player2.width &&
            game.ball.y > game.player2.y &&
            game.ball.y < game.player2.y + game.player2.height)
            return true;
        return false;
    };
    GameService.prototype.powerUpCollision = function (ball, pu) {
        if (ball.x >= pu.x &&
            ball.x <= pu.x + pu.size &&
            ball.y >= pu.y &&
            ball.y <= pu.y + pu.size)
            return true;
        return false;
    };
    GameService.prototype.movePaddle = function (game, playerId, direction) {
        if (playerId === 1) {
            if (direction === "ArrowUp") {
                if (game.player1.y > 0) {
                    game.player1.y -= 5;
                }
            }
            else if (direction === "ArrowDown") {
                if (game.player1.y + game.player1.height < game.height) {
                    game.player1.y += 5;
                }
            }
        }
        else if (playerId === 2) {
            if (direction === "ArrowUp") {
                if (game.player2.y > 0) {
                    game.player2.y -= 5;
                }
            }
            else if (direction === "ArrowDown") {
                if (game.player2.y + game.player2.height < game.height) {
                    game.player2.y += 5;
                }
            }
        }
        this.saveGame(game);
        return game;
    };
    // Fonction pour mettre à jour la position d'une balle
    GameService.prototype.updateBall = function (game) {
        // Mettre à jour la position de la balle en fonction de sa vitesse
        game.ball.x += game.ball.speedX;
        game.ball.y += game.ball.speedY;
        // Vérifier la collision avec les limites du canvas
        if (game.ball.y < 0) {
            game.ball.speedY *= -1;
            game.ball.y = 0;
        }
        else if (game.ball.y + 10 > game.height) {
            game.ball.speedY *= -1;
            game.ball.y = game.height - game.ball.radius;
        }
        // paddle collision + update score
        if (this.player1Collision(game)) {
            game.ball.speedX *= -1;
            game.ball.x += game.player1.width;
            if ((game.ball.speedY < 0 &&
                game.ball.y > game.player1.y + game.player1.height / 2) ||
                (game.ball.speedY > 0 &&
                    game.ball.y < game.player1.y + game.player1.height / 2))
                game.ball.speedY *= -1;
        }
        else if (this.player2Collision(game)) {
            game.ball.speedX *= -1;
            game.ball.x -= game.player2.width;
            if ((game.ball.speedY < 0 &&
                game.ball.y > game.player2.y + game.player2.height / 2) ||
                (game.ball.speedY > 0 &&
                    game.ball.y < game.player2.y + game.player2.height / 2))
                game.ball.speedY *= -1;
        }
        else {
            if (game.ball.x <= 0) {
                game.player2.score++;
                game.ball = this.newBall(game.width, game.height, -1);
                game.scoreUpdate = true;
            }
            else if (game.ball.x >= game.width) {
                game.player1.score++;
                game.ball = this.newBall(game.width, game.height, 1);
                game.scoreUpdate = true;
            }
        }
        return game;
    };
    GameService.prototype.updatePowerUp = function (game) {
        var _this = this;
        var index = game.grid.findIndex(function (pu) {
            return _this.powerUpCollision(game.ball, pu);
        });
        if (index >= 0) {
            var powerUp = game.grid.splice(index, 1)[0];
            console.log(powerUp);
            if (!powerUp.type) {
                if (game.ball.speedX < 0)
                    game.player2.height += 10;
                else
                    game.player1.height += 10;
            }
            else {
                if (game.ball.speedX < 0)
                    game.player1.height -= 10;
                else
                    game.player2.height -= 10;
            }
        }
        return game;
    };
    GameService.prototype.spawnPowerUp = function (game) {
        if (Math.random() >= 0.999) {
            var x_1 = Math.floor(Math.random() * 700) + 50;
            var y_1 = Math.floor(Math.random() * 500) + 50;
            if (game.grid.find(function (pu) { return pu.x === x_1 && pu.y === y_1; }) ||
                (x_1 > game.width / 2 - 10 && x_1 < game.width / 2 + 25)) {
                return game;
            }
            game.grid.push({ x: x_1, y: y_1, type: Math.floor(Math.random() * 2), size: 20 });
        }
        return game;
    };
    GameService = __decorate([
        (0, common_1.Injectable)(),
        __param(0, (0, typeorm_1.InjectRepository)(database_1.Game)),
        __param(1, (0, typeorm_1.InjectRepository)(database_1.User))
    ], GameService);
    return GameService;
}());
exports.GameService = GameService;
