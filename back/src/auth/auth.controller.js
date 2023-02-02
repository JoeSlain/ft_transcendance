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
exports.AuthController = void 0;
var common_1 = require("@nestjs/common");
var _42_guard_1 = require("./42auth/42.guard");
var _2fa_guard_1 = require("./2fa/2fa.guard");
var local_guard_1 = require("./local.guard");
var AuthController = /** @class */ (function () {
    function AuthController(twoFactorAuthenticationService, usersService, authService) {
        this.twoFactorAuthenticationService = twoFactorAuthenticationService;
        this.usersService = usersService;
        this.authService = authService;
    }
    AuthController.prototype.login = function () {
        console.log("login");
        return;
    };
    //@UseGuards(TwoFactorGuard)
    AuthController.prototype.logout = function (req) {
        var cookie = this.authService.getLogoutCookie();
        console.log("logout");
        req.res.setHeader("Set-Cookie", cookie);
        return;
    };
    AuthController.prototype.redirect = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var accessTokenCookie;
            return __generator(this, function (_a) {
                accessTokenCookie = this.authService.getCookieWithJwtToken(req.user.id);
                console.log("redirect");
                req.res.setHeader("Set-Cookie", [accessTokenCookie]);
                if (req.user.isTwoFactorAuthenticationEnabled)
                    res.redirect("http://localhost:3000/login/2fa");
                else {
                    res.redirect("http://localhost:3000/login/redirect");
                    console.log("2fa is off, redirected ");
                }
                return [2 /*return*/];
            });
        });
    };
    // test for devs only
    AuthController.prototype.devLogin = function (req, _a) {
        var username = _a.username;
        return __awaiter(this, void 0, void 0, function () {
            var accessTokenCookie;
            return __generator(this, function (_b) {
                /*const user = await this.usersService.getByUsername(username);
            
                    console.log('devlogin')
                    console.log('username', username)
                    console.log('user in dev log', user)*/
                if (req.user) {
                    accessTokenCookie = this.authService.getCookieWithJwtToken(req.user.id);
                    req.res.setHeader("Set-Cookie", [accessTokenCookie]);
                }
                return [2 /*return*/, req.user];
            });
        });
    };
    AuthController.prototype.register = function (res, req) {
        return __awaiter(this, void 0, void 0, function () {
            var otpauthUrl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("2fa");
                        console.log("req user", req.user);
                        return [4 /*yield*/, this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(req.user)];
                    case 1:
                        otpauthUrl = (_a.sent()).otpauthUrl;
                        return [2 /*return*/, this.twoFactorAuthenticationService.pipeQrCodeStream(res, otpauthUrl)];
                }
            });
        });
    };
    AuthController.prototype.turnOnTwoFactorAuthentication = function (req, _a) {
        var code = _a.code;
        return __awaiter(this, void 0, void 0, function () {
            var isCodeValid, accessTokenCookie;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log("turn on", code);
                        return [4 /*yield*/, this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(code, req.user)];
                    case 1:
                        isCodeValid = _b.sent();
                        /*console.log('2fa turn on')
                            console.log(isCodeValid)*/
                        if (!isCodeValid) {
                            return [2 /*return*/, false];
                        }
                        return [4 /*yield*/, this.usersService.turnOnTwoFactorAuthentication(req.user.id)];
                    case 2:
                        _b.sent();
                        accessTokenCookie = this.authService.getCookieWithJwtAccessToken(req.user.id, true);
                        req.res.setHeader("Set-Cookie", [accessTokenCookie]);
                        console.log("true");
                        return [2 /*return*/, true];
                }
            });
        });
    };
    AuthController.prototype.turnOffTwoFactorAuthentication = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var ret;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.usersService.turnOffTwoFactorAuthentication(req.user.id)];
                    case 1:
                        ret = _a.sent();
                        return [2 /*return*/, ret];
                }
            });
        });
    };
    AuthController.prototype.authenticate = function (req, _a) {
        var code = _a.code;
        return __awaiter(this, void 0, void 0, function () {
            var isCodeValid, accessTokenCookie;
            return __generator(this, function (_b) {
                console.log("2fa auth");
                isCodeValid = this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(code, req.user);
                if (!isCodeValid)
                    return [2 /*return*/, null];
                accessTokenCookie = this.authService.getCookieWithJwtAccessToken(req.user.id, true);
                req.res.setHeader("Set-Cookie", [accessTokenCookie]);
                return [2 /*return*/, req.user];
            });
        });
    };
    __decorate([
        (0, common_1.Get)("login"),
        (0, common_1.UseGuards)(_42_guard_1.FortyTwoAuthGuard)
    ], AuthController.prototype, "login");
    __decorate([
        (0, common_1.Post)("logout")
        //@UseGuards(TwoFactorGuard)
        ,
        __param(0, (0, common_1.Req)())
    ], AuthController.prototype, "logout");
    __decorate([
        (0, common_1.Get)("redirect"),
        (0, common_1.UseGuards)(_42_guard_1.FortyTwoAuthGuard),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_1.Res)())
    ], AuthController.prototype, "redirect");
    __decorate([
        (0, common_1.UseGuards)(local_guard_1.LocalAuthenticationGuard),
        (0, common_1.Post)("devlog"),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_1.Body)())
    ], AuthController.prototype, "devLogin");
    __decorate([
        (0, common_1.Post)("2fa/generate"),
        (0, common_1.UseGuards)(_2fa_guard_1.TwoFactorGuard),
        __param(0, (0, common_1.Res)()),
        __param(1, (0, common_1.Req)())
    ], AuthController.prototype, "register");
    __decorate([
        (0, common_1.Post)("2fa/turn-on"),
        (0, common_1.UseGuards)(_2fa_guard_1.TwoFactorGuard),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_1.Body)())
    ], AuthController.prototype, "turnOnTwoFactorAuthentication");
    __decorate([
        (0, common_1.Post)("2fa/turn-off"),
        (0, common_1.UseGuards)(_2fa_guard_1.TwoFactorGuard),
        __param(0, (0, common_1.Req)())
    ], AuthController.prototype, "turnOffTwoFactorAuthentication");
    __decorate([
        (0, common_1.Post)("2fa/authenticate"),
        (0, common_1.UseGuards)(_42_guard_1.AuthenticatedGuard),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_1.Body)())
    ], AuthController.prototype, "authenticate");
    AuthController = __decorate([
        (0, common_1.Controller)("auth")
    ], AuthController);
    return AuthController;
}());
exports.AuthController = AuthController;
