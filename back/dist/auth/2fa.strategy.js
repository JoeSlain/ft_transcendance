"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwoFactorStrategy = void 0;
const passport_jwt_1 = require("passport-jwt");
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const users_service_1 = require("../users/users.service");
let TwoFactorStrategy = class TwoFactorStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor(usersService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromExtractors([(req) => {
                    var _a;
                    return (_a = req === null || req === void 0 ? void 0 : req.cookies) === null || _a === void 0 ? void 0 : _a.Authentication;
                }]),
            secretOrKey: process.env.FT_SECRET
        });
        this.usersService = usersService;
    }
    async validate(payload) {
        const user = await this.usersService.getById(payload.userId);
        if (!user.isTwoFactorAuthenticationEnabled) {
            return user;
        }
        if (payload.isSecondFactorAuthenticated) {
            return user;
        }
    }
};
TwoFactorStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], TwoFactorStrategy);
exports.TwoFactorStrategy = TwoFactorStrategy;
//# sourceMappingURL=2fa.strategy.js.map