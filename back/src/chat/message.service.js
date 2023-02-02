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
exports.MessageService = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var database_1 = require("../database");
var MessageService = /** @class */ (function () {
    function MessageService(userRepo, msgRepo, dmRepo, convRepo) {
        this.userRepo = userRepo;
        this.msgRepo = msgRepo;
        this.dmRepo = dmRepo;
        this.convRepo = convRepo;
    }
    MessageService.prototype.findById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var message;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.msgRepo.find({
                            where: {
                                id: id
                            },
                            relations: {
                                from: true,
                                channel: true
                            }
                        })];
                    case 1:
                        message = _a.sent();
                        return [2 /*return*/, message[0]];
                }
            });
        });
    };
    MessageService.prototype.createChanMessage = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var message;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        message = this.msgRepo.create({
                            content: data.content,
                            from: data.from,
                            channel: data.channel
                        });
                        return [4 /*yield*/, this.msgRepo.save(message)];
                    case 1:
                        message = _a.sent();
                        return [2 /*return*/, message];
                }
            });
        });
    };
    MessageService.prototype.getNewMessages = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var user, convs, ret, conv;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userRepo.findOneBy({ id: id })];
                    case 1:
                        user = _a.sent();
                        if (!user)
                            return [2 /*return*/];
                        return [4 /*yield*/, this.convRepo
                                .createQueryBuilder("conv")
                                .leftJoinAndSelect("conv.messages", "msg")
                                .leftJoinAndSelect("conv.user1", "user1")
                                .leftJoinAndSelect("conv.user2", "user2")
                                .leftJoinAndSelect("msg.from", "from")
                                .where("conv.user1.id = :uid1 AND conv.new1 = :new1", {
                                uid1: id,
                                new1: true
                            })
                                .orWhere("conv.user2.id = :uid2 AND conv.new2 = :new2", {
                                uid2: id,
                                new2: true
                            })
                                .orderBy({ "msg.id": "ASC" })
                                .getMany()];
                    case 2:
                        convs = _a.sent();
                        if (convs && user.blocked)
                            convs = convs.filter(function (conv) {
                                return !user.blocked.includes(conv.user1.id) &&
                                    !user.blocked.includes(conv.user2.id);
                            });
                        console.log("convs", convs);
                        ret = [];
                        while (convs.length) {
                            conv = convs.shift();
                            //conv = await this.updateNewMessages(conv, id);
                            ret.push({
                                id: conv.id,
                                messages: conv.messages,
                                to: conv.user1.id === id ? conv.user2 : conv.user1,
                                show: false
                            });
                        }
                        return [2 /*return*/, ret];
                }
            });
        });
    };
    MessageService.prototype.findConvById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.convRepo.findOne({
                            where: {
                                id: id
                            },
                            relations: ["user1", "user2", "messages", "messages.from"]
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MessageService.prototype.getConversation = function (me, to) {
        return __awaiter(this, void 0, void 0, function () {
            var conv;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.convRepo.findOne({
                            relations: {
                                messages: {
                                    from: true
                                },
                                user1: true,
                                user2: true
                            },
                            where: [
                                {
                                    user1: {
                                        id: me.id
                                    },
                                    user2: {
                                        id: to.id
                                    }
                                },
                                {
                                    user1: {
                                        id: to.id
                                    },
                                    user2: {
                                        id: me.id
                                    }
                                },
                            ]
                        })];
                    case 1:
                        conv = _a.sent();
                        if (!conv) {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, conv]; /*{
                          id: conv.id,
                          messages: conv.messages,
                          to,
                          show: true,
                        };*/
                }
            });
        });
    };
    MessageService.prototype.createConversation = function (me, to) {
        return __awaiter(this, void 0, void 0, function () {
            var conv;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        conv = this.convRepo.create({
                            user1: me,
                            user2: to
                        });
                        return [4 /*yield*/, this.convRepo.save(conv)];
                    case 1:
                        conv = _a.sent();
                        return [2 /*return*/, conv]; /*{
                          id: conv.id,
                          messages: [],
                          to,
                          show: true,
                        };*/
                }
            });
        });
    };
    MessageService.prototype.createDm = function (from, content) {
        return __awaiter(this, void 0, void 0, function () {
            var dm;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dm = this.dmRepo.create({ from: from, content: content });
                        return [4 /*yield*/, this.dmRepo.save(dm)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MessageService.prototype.pushDm = function (conversation, dm) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (dm.from.id === conversation.user1.id)
                            conversation.new2 = true;
                        else
                            conversation.new1 = true;
                        conversation.messages.push(dm);
                        return [4 /*yield*/, this.convRepo.save(conversation)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MessageService.prototype.updateNewMessages = function (conv, userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (userId === conv.user1.id)
                            conv.new1 = false;
                        else if (userId === conv.user2.id)
                            conv.new2 = false;
                        return [4 /*yield*/, this.convRepo.save(conv)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MessageService = __decorate([
        (0, common_1.Injectable)(),
        __param(0, (0, typeorm_1.InjectRepository)(database_1.User)),
        __param(1, (0, typeorm_1.InjectRepository)(database_1.ChanMessage)),
        __param(2, (0, typeorm_1.InjectRepository)(database_1.DirectMessage)),
        __param(3, (0, typeorm_1.InjectRepository)(database_1.Conversation))
    ], MessageService);
    return MessageService;
}());
exports.MessageService = MessageService;
