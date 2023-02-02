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
exports.ChannelService = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var database_1 = require("../database");
var bcrypt = require("bcrypt");
var ChannelService = /** @class */ (function () {
    function ChannelService(chanRepo, msgRepo, userRepo, restrictionRepo, notifService) {
        this.chanRepo = chanRepo;
        this.msgRepo = msgRepo;
        this.userRepo = userRepo;
        this.restrictionRepo = restrictionRepo;
        this.notifService = notifService;
    }
    ChannelService.prototype.findChannel = function (name, type) {
        return __awaiter(this, void 0, void 0, function () {
            var channel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.chanRepo.find({
                            where: {
                                name: name,
                                type: type
                            }
                        })];
                    case 1:
                        channel = _a.sent();
                        return [2 /*return*/, channel[0]];
                }
            });
        });
    };
    ChannelService.prototype.findChannelById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var channel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.chanRepo.findOne({
                            where: {
                                id: id
                            },
                            relations: {
                                users: true,
                                owner: true,
                                banned: true,
                                admins: true,
                                muted: true,
                                messages: {
                                    from: true
                                }
                            },
                            order: {
                                messages: {
                                    id: "ASC"
                                }
                            }
                        })];
                    case 1:
                        channel = _a.sent();
                        /* const messages = await this.msgRepo
                          .createQueryBuilder("message")
                          .leftJoinAndSelect("message.channel", "chan")
                          .leftJoinAndSelect("message.from", "from")
                          .where("chan.id = :id", { id })
                          .orderBy("chan.id", "DESC")
                          .take(10)
                          .getMany();
                    
                        channel.messages = messages;*/
                        //console.log("chanfound", channel);
                        return [2 /*return*/, channel];
                }
            });
        });
    };
    ChannelService.prototype.getChannelWithUsers = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var channel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.chanRepo.find({
                            where: {
                                id: id
                            },
                            relations: {
                                users: true,
                                owner: true
                            }
                        })];
                    case 1:
                        channel = _a.sent();
                        channel[0].password = null;
                        return [2 /*return*/, channel[0]];
                }
            });
        });
    };
    ChannelService.prototype.getPublicChannels = function () {
        return __awaiter(this, void 0, void 0, function () {
            var tmp, chans;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.chanRepo.find({
                            where: [{ type: "public" }, { type: "protected" }],
                            relations: {
                                owner: true,
                                users: true,
                                banned: true
                            }
                        })];
                    case 1:
                        tmp = _a.sent();
                        chans = tmp.map(function (chan) {
                            chan.password = null;
                            return chan;
                        });
                        return [2 /*return*/, chans];
                }
            });
        });
    };
    ChannelService.prototype.getPrivateChannels = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var tmp, chans;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.chanRepo
                            .createQueryBuilder("channels")
                            .leftJoinAndSelect("channels.users", "user")
                            .leftJoinAndSelect("channels.owner", "owner")
                            .leftJoinAndSelect("channels.banned", "banned")
                            .where("channels.type = :type", { type: "private" })
                            .andWhere("user.id = :userId", { userId: userId })
                            /*new Brackets((qb) => {
                                qb.where("banned.userId = :bannedId", { bannedId }).orWhere(
                                  "user.id = :userId",
                                  { userId }
                                );
                              })
                            )*/
                            .getMany()];
                    case 1:
                        tmp = _a.sent();
                        chans = tmp.map(function (chan) {
                            return __assign(__assign({}, chan), { password: null });
                        });
                        return [2 /*return*/, chans];
                }
            });
        });
    };
    ChannelService.prototype.getChannels = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var publicChans, privateChans, ret;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getPublicChannels()];
                    case 1:
                        publicChans = _a.sent();
                        return [4 /*yield*/, this.getPrivateChannels(userId)];
                    case 2:
                        privateChans = _a.sent();
                        ret = publicChans.concat(privateChans);
                        //console.log("concat chans", ret);
                        return [2 /*return*/, ret];
                }
            });
        });
    };
    ChannelService.prototype.checkChanData = function (chanData) {
        return __awaiter(this, void 0, void 0, function () {
            var chan, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!chanData.name)
                            return [2 /*return*/, "invalid channel name"];
                        if (!(chanData.type === "public" || chanData.type === "protected")) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.findChannel(chanData.name, "public")];
                    case 1:
                        _a = (_b.sent());
                        if (_a) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.findChannel(chanData.name, "protected")];
                    case 2:
                        _a = (_b.sent());
                        _b.label = 3;
                    case 3:
                        chan = _a;
                        if (chan)
                            return [2 /*return*/, "invalid channel name"];
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, this.findChannel(chanData.name, "private")];
                    case 5:
                        if (_b.sent())
                            return [2 /*return*/, "invalid channel name"];
                        _b.label = 6;
                    case 6:
                        if (chanData.type === "protected" && !chanData.password)
                            return [2 /*return*/, "invalid password"];
                        return [2 /*return*/, null];
                }
            });
        });
    };
    ChannelService.prototype.checkChanPassword = function (pass, cryptedPass) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, bcrypt.compare(pass, cryptedPass)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ChannelService.prototype.setChanPassword = function (channel, pass) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, chan;
            var _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _b = (_a = this.chanRepo).update;
                        _c = [channel.id];
                        _d = {};
                        return [4 /*yield*/, bcrypt.hash(pass, 10)];
                    case 1: return [4 /*yield*/, _b.apply(_a, _c.concat([(_d.password = _e.sent(),
                                _d.type = "protected",
                                _d)]))];
                    case 2:
                        _e.sent();
                        return [4 /*yield*/, this.findChannelById(channel.id)];
                    case 3:
                        chan = _e.sent();
                        return [2 /*return*/, chan];
                }
            });
        });
    };
    ChannelService.prototype.removeChanPassword = function (channel) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        channel.password = null;
                        channel.type = "public";
                        return [4 /*yield*/, this.chanRepo.save(channel)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ChannelService.prototype.setChanOwner = function (user, channel) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        channel.owner = user;
                        return [4 /*yield*/, this.chanRepo.save(channel)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ChannelService.prototype.addUserChan = function (user, chan, role) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        chan[role].push(user);
                        return [4 /*yield*/, this.chanRepo.save(chan)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ChannelService.prototype.createChannel = function (chanData) {
        return __awaiter(this, void 0, void 0, function () {
            var hashedPassword, channel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        hashedPassword = null;
                        if (!(chanData.type === "protected")) return [3 /*break*/, 2];
                        return [4 /*yield*/, bcrypt.hash(chanData.password, 10)];
                    case 1:
                        hashedPassword = _a.sent();
                        _a.label = 2;
                    case 2:
                        channel = this.chanRepo.create({
                            name: chanData.name,
                            type: chanData.type,
                            socketId: "".concat(chanData.type, "/").concat(chanData.name),
                            password: hashedPassword
                        });
                        return [4 /*yield*/, this.chanRepo.save(channel)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.findChannelById(channel.id)];
                    case 4:
                        channel = _a.sent();
                        return [4 /*yield*/, this.setChanOwner(chanData.owner, channel)];
                    case 5:
                        channel = _a.sent();
                        return [4 /*yield*/, this.addUserChan(chanData.owner, channel, "users")];
                    case 6:
                        channel = _a.sent();
                        //console.log("created channel", channel);
                        return [2 /*return*/, channel];
                }
            });
        });
    };
    ChannelService.prototype.findUserInChan = function (userId, channel) {
        if (!channel.users)
            return false;
        var found = channel.users.find(function (user) { return user.id === userId; });
        return found;
    };
    ChannelService.prototype.removeUserChan = function (user, chan) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                chan.admins = chan.admins.filter(function (u) { return u.id !== user.id; });
                chan.users = chan.users.filter(function (u) { return u.id !== user.id; });
                return [2 /*return*/, this.chanRepo.save(chan)];
            });
        });
    };
    ChannelService.prototype.deleteChan = function (chan) {
        return __awaiter(this, void 0, void 0, function () {
            var notifs;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.notifService.getChanNotifs(chan)];
                    case 1:
                        notifs = _a.sent();
                        chan.banned.forEach(function (ban) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.restrictionRepo.remove(ban)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        chan.muted.forEach(function (mute) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.restrictionRepo.remove(mute)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        notifs.forEach(function (notif) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.notifService.deleteNotif(notif)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        return [4 /*yield*/, this.chanRepo
                                .createQueryBuilder()
                                .relation(database_1.Channel, "messages")
                                .of(chan)
                                .remove(chan.messages)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.chanRepo
                                .createQueryBuilder("channels")["delete"]()
                                .from(database_1.Channel)
                                .where("id = :id", { id: chan.id })
                                .execute()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ChannelService.prototype.leaveChan = function (user, chan) {
        return __awaiter(this, void 0, void 0, function () {
            var channel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findChannelById(chan.id)];
                    case 1:
                        channel = _a.sent();
                        return [4 /*yield*/, this.removeUserChan(user, channel)];
                    case 2:
                        channel = _a.sent();
                        if (!(channel.owner.id === user.id)) return [3 /*break*/, 10];
                        if (!(channel.admins && channel.admins[0])) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.setChanOwner(channel.admins[0], channel)];
                    case 3:
                        channel = _a.sent();
                        return [3 /*break*/, 10];
                    case 4:
                        if (!(channel.users && channel.users[0])) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.setChanOwner(channel.users[0], channel)];
                    case 5:
                        channel = _a.sent();
                        return [3 /*break*/, 10];
                    case 6:
                        if (!(channel.type === "private")) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.deleteChan(channel)];
                    case 7:
                        _a.sent();
                        return [2 /*return*/, null];
                    case 8: return [4 /*yield*/, this.setChanOwner(null, channel)];
                    case 9:
                        channel = _a.sent();
                        _a.label = 10;
                    case 10: return [2 /*return*/, channel];
                }
            });
        });
    };
    ChannelService = __decorate([
        (0, common_1.Injectable)(),
        __param(0, (0, typeorm_1.InjectRepository)(database_1.Channel)),
        __param(1, (0, typeorm_1.InjectRepository)(database_1.ChanMessage)),
        __param(2, (0, typeorm_1.InjectRepository)(database_1.User)),
        __param(3, (0, typeorm_1.InjectRepository)(database_1.Restriction))
    ], ChannelService);
    return ChannelService;
}());
exports.ChannelService = ChannelService;
