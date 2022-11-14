"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const passport_1 = require("@nestjs/passport");
const _42_strategy_1 = require("./42auth/42.strategy");
const auth_controller_1 = require("./auth.controller");
const typeorm_1 = require("@nestjs/typeorm");
const User_1 = require("../database/entities/User");
const Serializer_1 = require("./utils/Serializer");
const users_module_1 = require("../users/users.module");
const _2fa_service_1 = require("./2fa/2fa.service");
const users_service_1 = require("../users/users.service");
const jwt_1 = require("@nestjs/jwt");
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([User_1.User]),
            passport_1.PassportModule,
            users_module_1.UsersModule,
            jwt_1.JwtModule.register({
                secret: process.env.FT_SECRET,
                signOptions: {
                    expiresIn: process.env.COOKIE_EXPIRATION_TIME,
                }
            })
        ],
        providers: [
            _42_strategy_1.FortyTwoStrategy,
            Serializer_1.SessionSerializer,
            _2fa_service_1.TwoFactorAuthenticationService,
            users_service_1.UsersService,
            auth_service_1.AuthService,
            {
                provide: 'AUTH_SERVICE',
                useClass: auth_service_1.AuthService,
            },
        ],
        controllers: [auth_controller_1.AuthController],
    })
], AuthModule);
exports.AuthModule = AuthModule;
//# sourceMappingURL=auth.module.js.map