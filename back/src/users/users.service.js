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
exports.UsersService = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var database_1 = require("../database");
var UsersService = /** @class */ (function () {
    function UsersService(usersRepository, secretRepo, gameRepo) {
        this.usersRepository = usersRepository;
        this.secretRepo = secretRepo;
        this.gameRepo = gameRepo;
    }
    UsersService.prototype.setTwoFactorAuthenticationSecret = function (secret, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var newSecret, userWithSecret;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        newSecret = this.secretRepo.create({
                            key: secret
                        });
                        return [4 /*yield*/, this.secretRepo.save(newSecret)];
                    case 1:
                        newSecret = _a.sent();
                        return [4 /*yield*/, this.usersRepository.findOne({
                                relations: {
                                    secret: true
                                },
                                where: {
                                    id: userId
                                }
                            })];
                    case 2:
                        userWithSecret = _a.sent();
                        userWithSecret.secret = newSecret;
                        return [4 /*yield*/, this.usersRepository.save(userWithSecret)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    UsersService.prototype.turnOnTwoFactorAuthentication = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.usersRepository.update(userId, {
                        isTwoFactorAuthenticationEnabled: true
                    })];
            });
        });
    };
    UsersService.prototype.turnOffTwoFactorAuthentication = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.usersRepository.findOneBy({ id: userId })];
                    case 1:
                        user = _a.sent();
                        if (!user)
                            return [2 /*return*/, false];
                        return [4 /*yield*/, this.usersRepository.save(__assign(__assign({}, user), { isTwoFactorAuthenticationEnabled: false }))];
                    case 2:
                        user = _a.sent();
                        return [2 /*return*/, user.isTwoFactorAuthenticationEnabled === false];
                }
            });
        });
    };
    UsersService.prototype.getById = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.usersRepository.findOneBy({ id: userId })];
                    case 1:
                        user = _a.sent();
                        /*console.log('getById');
                            console.log(userId);
                            console.log(user);*/
                        return [2 /*return*/, user];
                }
            });
        });
    };
    UsersService.prototype.getByUsername = function (userName) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!userName)
                            return [2 /*return*/, null];
                        return [4 /*yield*/, this.usersRepository.findOneBy({ username: userName })];
                    case 1:
                        user = _a.sent();
                        /*console.log('getByUsername');
                            console.log(user);*/
                        return [2 /*return*/, user];
                }
            });
        });
    };
    UsersService.prototype.addFriend = function (me, user) {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("addFriend");
                        if (!(user && user.id !== me.id)) return [3 /*break*/, 5];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.usersRepository
                                .createQueryBuilder()
                                .relation(database_1.User, "friends")
                                .of(me)
                                .add(user)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.log("friend ".concat(user.username, " already added"));
                        return [2 /*return*/, null];
                    case 4:
                        console.log("friend added");
                        return [2 /*return*/, user];
                    case 5:
                        console.log("could'nt add user ".concat(user.username));
                        return [2 /*return*/, null];
                }
            });
        });
    };
    UsersService.prototype.getFriends = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var users;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.usersRepository.query(" SELECT * \n              FROM users U\n              WHERE U.id <> $1\n                AND EXISTS(\n                  SELECT 1\n                  FROM users_friends_users F\n                  WHERE (F.\"usersId_1\" = $1 AND F.\"usersId_2\" = U.id )\n                  OR (F.\"usersId_2\" = $1 AND F.\"usersId_1\" = U.id )\n                  );  ", [user.id])];
                    case 1:
                        users = _a.sent();
                        /*console.log('getFriends');
                            console.log(users);*/
                        return [2 /*return*/, users];
                }
            });
        });
    };
    UsersService.prototype.findFriend = function (userId, friendId) {
        return __awaiter(this, void 0, void 0, function () {
            var friend;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.usersRepository.query(" SELECT 1\n                FROM users_friends_users\n                WHERE (\"usersId_1\"=$1 AND \"usersId_2\"=$2)\n                OR (\"usersId_2\"=$1 and \"usersId_1\"=$2);\n            ", [userId, friendId])];
                    case 1:
                        friend = _a.sent();
                        return [2 /*return*/, friend];
                }
            });
        });
    };
    UsersService.prototype.deleteFriend = function (user, toDel) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.usersRepository
                            .createQueryBuilder()
                            .relation(database_1.User, "friends")
                            .of(user)
                            .remove(toDel)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.getFriends(user)];
                }
            });
        });
    };
    UsersService.prototype.updateStatus = function (userId, newStatus) {
        return __awaiter(this, void 0, void 0, function () {
            var modifiedUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getById(userId)];
                    case 1:
                        modifiedUser = _a.sent();
                        return [2 /*return*/, modifiedUser];
                }
            });
        });
    };
    UsersService.prototype.updateUsername = function (userId, username) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("🚀 ~ file: users.service.ts:119 ~ UsersService ~ updateUsername ~ username", username);
                        if (!username)
                            return [2 /*return*/, null];
                        return [4 /*yield*/, this.getByUsername(username)];
                    case 1:
                        if (_a.sent())
                            return [2 /*return*/, null];
                        return [4 /*yield*/, this.usersRepository.update(userId, {
                                username: username
                            })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.getById(userId)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    UsersService.prototype.updateUser = function (newUser) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("🚀 ~ file: users.service.ts:135 ~ UsersService ~ newUser.id", newUser);
                        return [4 /*yield*/, this.usersRepository.update(newUser.id, newUser)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getById(newUser.id)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /*async updateUserElo(userId: number, gameInfos: Game) {
      const win = userId === gameInfos.winnerId;
      let me, opponent;
  
      if (gameInfos.user1.id === userId) {
        me = gameInfos.user1;
        opponent = gameInfos.user2;
      } else {
        me = gameInfos.user2;
        opponent = gameInfos.user1;
      }
      if (win) {
        if (me.elo > opponent.elo) me.elo += 1;
        else if (me.elo === opponent.elo) me.elo += 10;
        else me.elo += 20;
        me.n_win++;
      } else {
        if (me.elo > opponent.elo) me.elo -= 20;
        else if (me.elo === opponent.elo) me.elo -= 10;
        else me.elo -= 1;
        me.n_lose++;
      }
  
      return await this.usersRepository.save(me);
    }*/
    UsersService.prototype.uploadAvatar = function (userId, url) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.usersRepository.update(userId, {
                            avatar: url
                        })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getById(userId)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    UsersService.prototype.block = function (myId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var me, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getById(myId)];
                    case 1:
                        me = _a.sent();
                        return [4 /*yield*/, this.getById(userId)];
                    case 2:
                        user = _a.sent();
                        if (!(me && user)) return [3 /*break*/, 4];
                        if (me.blocked && me.blocked.includes(userId))
                            return [2 /*return*/];
                        if (!me.blocked)
                            me.blocked = [userId];
                        else
                            me.blocked.push(userId);
                        return [4 /*yield*/, this.usersRepository.save(me)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4:
                        console.log("me", me);
                        return [2 /*return*/, me];
                }
            });
        });
    };
    UsersService.prototype.checkBlocked = function (myId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var me;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getById(myId)];
                    case 1:
                        me = _a.sent();
                        if (me && me.blocked && me.blocked.includes(userId)) {
                            console.log("blocked");
                            return [2 /*return*/, true];
                        }
                        return [2 /*return*/, false];
                }
            });
        });
    };
    UsersService.prototype.getGames = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var games;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.gameRepo.find({
                            relations: {
                                user1: true,
                                user2: true
                            },
                            where: [
                                {
                                    user1: {
                                        id: userId
                                    }
                                },
                                {
                                    user2: {
                                        id: userId
                                    }
                                },
                            ]
                        })];
                    case 1:
                        games = _a.sent();
                        return [2 /*return*/, games];
                }
            });
        });
    };
    UsersService = __decorate([
        (0, common_1.Injectable)(),
        __param(0, (0, typeorm_1.InjectRepository)(database_1.User)),
        __param(1, (0, typeorm_1.InjectRepository)(database_1.Secret)),
        __param(2, (0, typeorm_1.InjectRepository)(database_1.Game))
    ], UsersService);
    return UsersService;
}());
exports.UsersService = UsersService;
