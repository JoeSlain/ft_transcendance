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
exports.AuthService = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var User_1 = require("../database/entities/User");
var AuthService = /** @class */ (function () {
    function AuthService(userRepository, jwtService, usersService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.usersService = usersService;
    }
    AuthService.prototype.createUser = function (details) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                user = {
                    username: details.username,
                    id42: details.id42,
                    email: details.email,
                    winratio: "no games played",
                    profile_pic: details.img_url,
                    elo: 0,
                    n_win: 0,
                    n_lose: 0,
                    date_of_sign: new Date()
                };
                return [2 /*return*/, this.userRepository.create(user)];
            });
        });
    };
    AuthService.prototype.validateUser = function (details) {
        return __awaiter(this, void 0, void 0, function () {
            var user, newUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userRepository.findOneBy({ id42: details.id42 })];
                    case 1:
                        user = _a.sent();
                        //console.log(user);
                        if (user) {
                            return [2 /*return*/, user];
                        }
                        return [4 /*yield*/, this.createUser(details)];
                    case 2:
                        newUser = _a.sent();
                        /*console.log('user not found. Creating...')
                        console.log('newUser', newUser);*/
                        return [2 /*return*/, this.userRepository.save(newUser)];
                }
            });
        });
    };
    AuthService.prototype.findUser = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userRepository.findOneBy({ id: id })];
                    case 1:
                        user = _a.sent();
                        /*console.log('foundUser in db');
                        console.log(user ? 'found' : 'not found');
                        console.log('user');
                        console.log(user);*/
                        return [2 /*return*/, user];
                }
            });
        });
    };
    AuthService.prototype.getAuthenticatedUser = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            var user, details, newUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userRepository.findOneBy({ username: username })];
                    case 1:
                        user = _a.sent();
                        if (!!user) return [3 /*break*/, 3];
                        details = {
                            username: username,
                            email: "".concat(username, "@test.test"),
                            id42: null,
                            img_url: "none"
                        };
                        return [4 /*yield*/, this.createUser(details)];
                    case 2:
                        newUser = _a.sent();
                        newUser.elo = 0;
                        return [2 /*return*/, this.userRepository.save(newUser)];
                    case 3: return [2 /*return*/, user];
                }
            });
        });
    };
    // 42 cookie token
    AuthService.prototype.getCookieWithJwtToken = function (userId) {
        var payload = { userId: userId };
        var token = this.jwtService.sign(payload, {
            secret: process.env.FT_SECRET,
            expiresIn: process.env.COOKIE_EXPIRATION_TIME
        });
        return "Authentication=".concat(token, "; HttpOnly; Path=/; Max-Age=").concat(process.env.COOKIE_EXPIRATION_TIME);
    };
    // 2fa cookie token
    AuthService.prototype.getCookieWithJwtAccessToken = function (userId, isSecondFactorAuthenticated) {
        if (isSecondFactorAuthenticated === void 0) { isSecondFactorAuthenticated = false; }
        var payload = {
            userId: userId,
            isSecondFactorAuthenticated: isSecondFactorAuthenticated
        };
        var token = this.jwtService.sign(payload, {
            secret: process.env.FT_SECRET,
            expiresIn: process.env.COOKIE_EXPIRATION_TIME
        });
        return "Authentication=".concat(token, "; HttpOnly; Path=/; Max-Age=").concat(process.env.COOKIE_EXPIRATION_TIME);
    };
    // logout cookie
    AuthService.prototype.getLogoutCookie = function () {
        return "Authentication=; HttpOnly; Path=/; Max-Age=0";
    };
    AuthService.prototype.getUserFromAuthenticationToken = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var payload;
            return __generator(this, function (_a) {
                payload = this.jwtService.verify(token, {
                    secret: process.env.FT_SECRET
                });
                if (payload.userId) {
                    return [2 /*return*/, this.usersService.getById(payload.userId)];
                }
                return [2 /*return*/];
            });
        });
    };
    AuthService = __decorate([
        (0, common_1.Injectable)(),
        __param(0, (0, typeorm_1.InjectRepository)(User_1.User))
    ], AuthService);
    return AuthService;
}());
exports.AuthService = AuthService;
