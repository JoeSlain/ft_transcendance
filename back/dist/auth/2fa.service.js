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
exports.TwoFactorAuthenticationService = void 0;
const common_1 = require("@nestjs/common");
const otplib_1 = require("otplib");
const users_service_1 = require("../users/users.service");
const qrcode_1 = require("qrcode");
let TwoFactorAuthenticationService = class TwoFactorAuthenticationService {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async generateTwoFactorAuthenticationSecret(user) {
        const secret = otplib_1.authenticator.generateSecret();
        const otpauthUrl = otplib_1.authenticator.keyuri(user.email, 'transcendence2fa', secret);
        await this.usersService.setTwoFactorAuthenticationSecret(secret, user.id);
        return { secret, otpauthUrl };
    }
    async pipeQrCodeStream(stream, otpauthUrl) {
        return (0, qrcode_1.toFileStream)(stream, otpauthUrl);
    }
    isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode, user) {
        return otplib_1.authenticator.verify({
            token: twoFactorAuthenticationCode,
            secret: user.twoFactorAuthenticationSecret
        });
    }
};
TwoFactorAuthenticationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], TwoFactorAuthenticationService);
exports.TwoFactorAuthenticationService = TwoFactorAuthenticationService;
//# sourceMappingURL=2fa.service.js.map