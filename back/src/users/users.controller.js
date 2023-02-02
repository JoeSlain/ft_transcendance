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
exports.UsersController = void 0;
var common_1 = require("@nestjs/common");
var database_1 = require("../database");
var typeorm_1 = require("@nestjs/typeorm");
var _2fa_guard_1 = require("../auth/2fa/2fa.guard");
var platform_express_1 = require("@nestjs/platform-express");
var multer_1 = require("multer");
var PostDTO = /** @class */ (function () {
    function PostDTO() {
    }
    return PostDTO;
}());
var UsersController = /** @class */ (function () {
    function UsersController(userRepository, usersService, notifService) {
        this.userRepository = userRepository;
        this.usersService = usersService;
        this.notifService = notifService;
    }
    UsersController.prototype.findMe = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userRepository.findOneBy({ id: req.user.id })];
                    case 1:
                        user = _a.sent();
                        /*console.log('get profile', req.user.id);
                            console.log(user);*/
                        return [2 /*return*/, user];
                }
            });
        });
    };
    UsersController.prototype.findOneById = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("🚀 ~ file: users.controller.ts:49 ~ UsersController ~ findOneById ~ params", params);
                        return [4 /*yield*/, this.userRepository.findOneBy({
                                id: parseInt(params.id)
                            })];
                    case 1:
                        user = _a.sent();
                        console.log("get profile", user.username);
                        return [2 /*return*/, user];
                }
            });
        });
    };
    UsersController.prototype.findOneByUsername = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userRepository.findOneBy({
                            username: params.username
                        })];
                    case 1:
                        user = _a.sent();
                        /*console.log('find by username')
                            console.log(user);*/
                        return [2 /*return*/, user];
                }
            });
        });
    };
    UsersController.prototype.addFriend = function (req, _a) {
        var username = _a.username;
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.usersService.addFriend(req.user, username)];
                    case 1:
                        user = _b.sent();
                        return [2 /*return*/, user];
                }
            });
        });
    };
    UsersController.prototype.getFriends = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var users;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("get friends");
                        return [4 /*yield*/, this.usersService.getFriends(req.user)];
                    case 1:
                        users = _a.sent();
                        //console.log('friends', users)
                        return [2 /*return*/, users];
                }
            });
        });
    };
    UsersController.prototype.deleteFriend = function (req, _a) {
        var userId = _a.userId;
        return __awaiter(this, void 0, void 0, function () {
            var users;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.usersService.deleteFriend(req.user, userId)];
                    case 1:
                        users = _b.sent();
                        return [2 /*return*/, users];
                }
            });
        });
    };
    UsersController.prototype.getNotifs = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var notifs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.notifService.getNotifs(req.user.id)];
                    case 1:
                        notifs = _a.sent();
                        console.log("notifs", notifs);
                        return [2 /*return*/, notifs];
                }
            });
        });
    };
    /**
     * @brief Updates user in database
     * @param req : userType
     * @returns updated user
     */
    UsersController.prototype.updateUser = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("REQUEST BODY: ", req.body);
                        return [4 /*yield*/, this.usersService.updateUser(req.body.user)];
                    case 1:
                        user = _a.sent();
                        console.log("🚀 ~ file: users.controller.ts:109  UPDATEUSER", user);
                        return [2 /*return*/, user];
                }
            });
        });
    };
    /**
     * @brief Updates user's username in database
     * @param req : userType
     * @returns updated user
     */
    UsersController.prototype.updateUsername = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("REQUEST BODY: ", req.body);
                        return [4 /*yield*/, this.usersService.updateUsername(req.body.id, req.body.username)];
                    case 1:
                        user = _a.sent();
                        return [2 /*return*/, user];
                }
            });
        });
    };
    UsersController.prototype.uploadAvatar = function (req, file) {
        return __awaiter(this, void 0, void 0, function () {
            var ret;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("🚀 ~ file: users.controller.ts:135 ~ UsersController ~ req", req);
                        return [4 /*yield*/, this.usersService.uploadAvatar(req.user.id, file.filename)];
                    case 1:
                        ret = _a.sent();
                        console.log("🚀 ~ file: users.controller.ts:138 ~ UsersController ~ ret", ret);
                        return [2 /*return*/, ret];
                }
            });
        });
    };
    UsersController.prototype.getAvatar = function (req, res) {
        var path = req.user.avatar;
        console.log("path", path);
        if (path)
            return res.sendFile(path, { root: "./uploads" });
        console.log("error geting avatar: invalid file path");
    };
    UsersController.prototype.getAvatarById = function (params, res) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.usersService.getById(params.id)];
                    case 1:
                        user = _a.sent();
                        if (user && user.avatar)
                            return [2 /*return*/, res.sendFile(user.avatar, { root: "./uploads" })];
                        console.log("error getting avatar: invalid user or file path");
                        return [2 /*return*/];
                }
            });
        });
    };
    UsersController.prototype.blockUser = function (req, _a) {
        var userId = _a.userId;
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.usersService.block(req.user.id, userId)];
                    case 1:
                        user = _b.sent();
                        return [2 /*return*/, user];
                }
            });
        });
    };
    UsersController.prototype.getGames = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var games;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("get games ".concat(params.id));
                        return [4 /*yield*/, this.usersService.getGames(params.id)];
                    case 1:
                        games = _a.sent();
                        console.log("returned games", games);
                        return [2 /*return*/, games];
                }
            });
        });
    };
    __decorate([
        (0, common_1.Get)(""),
        (0, common_1.UseGuards)(_2fa_guard_1.TwoFactorGuard),
        __param(0, (0, common_1.Req)())
    ], UsersController.prototype, "findMe");
    __decorate([
        (0, common_1.Get)("userid/:id"),
        (0, common_1.UseGuards)(_2fa_guard_1.TwoFactorGuard),
        __param(0, (0, common_1.Param)())
    ], UsersController.prototype, "findOneById");
    __decorate([
        (0, common_1.Get)("username/:username"),
        (0, common_1.UseGuards)(_2fa_guard_1.TwoFactorGuard),
        __param(0, (0, common_1.Param)())
    ], UsersController.prototype, "findOneByUsername");
    __decorate([
        (0, common_1.Post)("addFriend"),
        (0, common_1.UseGuards)(_2fa_guard_1.TwoFactorGuard),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_1.Body)())
    ], UsersController.prototype, "addFriend");
    __decorate([
        (0, common_1.Get)("friends"),
        (0, common_1.UseGuards)(_2fa_guard_1.TwoFactorGuard),
        __param(0, (0, common_1.Req)())
    ], UsersController.prototype, "getFriends");
    __decorate([
        (0, common_1.Post)("deleteFriend"),
        (0, common_1.UseGuards)(_2fa_guard_1.TwoFactorGuard),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_1.Body)())
    ], UsersController.prototype, "deleteFriend");
    __decorate([
        (0, common_1.Get)("notifs"),
        (0, common_1.UseGuards)(_2fa_guard_1.TwoFactorGuard),
        __param(0, (0, common_1.Req)())
    ], UsersController.prototype, "getNotifs");
    __decorate([
        (0, common_1.Post)("updateUser"),
        (0, common_1.UseGuards)(_2fa_guard_1.TwoFactorGuard),
        __param(0, (0, common_1.Req)())
    ], UsersController.prototype, "updateUser");
    __decorate([
        (0, common_1.Post)("updateUsername"),
        (0, common_1.UseGuards)(_2fa_guard_1.TwoFactorGuard),
        __param(0, (0, common_1.Req)())
    ], UsersController.prototype, "updateUsername");
    __decorate([
        (0, common_1.Post)("uploadAvatar"),
        (0, common_1.UseGuards)(_2fa_guard_1.TwoFactorGuard),
        (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file", {
            storage: (0, multer_1.diskStorage)({
                destination: "./uploads",
                filename: function (req, file, callback) {
                    if (!file.originalname)
                        callback(new Error("error uploading avatar"), file.fieldname);
                    else {
                        console.log("filename", file.originalname);
                        var filename = file.originalname;
                        callback(null, filename);
                    }
                }
            })
        })),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_1.UploadedFile)())
    ], UsersController.prototype, "uploadAvatar");
    __decorate([
        (0, common_1.Get)("getAvatar"),
        (0, common_1.UseGuards)(_2fa_guard_1.TwoFactorGuard),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_1.Res)())
    ], UsersController.prototype, "getAvatar");
    __decorate([
        (0, common_1.Get)("getAvatar/:id"),
        (0, common_1.UseGuards)(_2fa_guard_1.TwoFactorGuard),
        __param(0, (0, common_1.Param)()),
        __param(1, (0, common_1.Res)())
    ], UsersController.prototype, "getAvatarById");
    __decorate([
        (0, common_1.Post)("blockUser"),
        (0, common_1.UseGuards)(_2fa_guard_1.TwoFactorGuard),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_1.Body)())
    ], UsersController.prototype, "blockUser");
    __decorate([
        (0, common_1.Get)("games/:id"),
        (0, common_1.UseGuards)(_2fa_guard_1.TwoFactorGuard),
        __param(0, (0, common_1.Param)())
    ], UsersController.prototype, "getGames");
    UsersController = __decorate([
        (0, common_1.Controller)("users"),
        __param(0, (0, typeorm_1.InjectRepository)(database_1.User))
    ], UsersController);
    return UsersController;
}());
exports.UsersController = UsersController;
