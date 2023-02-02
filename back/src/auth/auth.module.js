"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AuthModule = void 0;
var common_1 = require("@nestjs/common");
var auth_service_1 = require("./auth.service");
var passport_1 = require("@nestjs/passport");
var _42_strategy_1 = require("./42auth/42.strategy");
var auth_controller_1 = require("./auth.controller");
var typeorm_1 = require("@nestjs/typeorm");
var User_1 = require("../database/entities/User");
var Serializer_1 = require("./utils/Serializer");
var _2fa_service_1 = require("./2fa/2fa.service");
var users_service_1 = require("../users/users.service");
var jwt_1 = require("@nestjs/jwt");
var _2fa_strategy_1 = require("./2fa/2fa.strategy");
var local_strategy_1 = require("./local.strategy");
var database_1 = require("../database");
var AuthModule = /** @class */ (function () {
    function AuthModule() {
    }
    AuthModule = __decorate([
        (0, common_1.Module)({
            imports: [
                typeorm_1.TypeOrmModule.forFeature([User_1.User, database_1.Game, database_1.Secret]),
                passport_1.PassportModule,
                jwt_1.JwtModule.register({
                    secret: process.env.FT_SECRET,
                    signOptions: {
                        expiresIn: process.env.COOKIE_EXPIRATION_TIME
                    }
                }),
            ],
            providers: [
                _42_strategy_1.FortyTwoStrategy,
                _2fa_strategy_1.TwoFactorStrategy,
                local_strategy_1.LocalStrategy,
                Serializer_1.SessionSerializer,
                _2fa_service_1.TwoFactorAuthenticationService,
                users_service_1.UsersService,
                auth_service_1.AuthService,
            ],
            controllers: [auth_controller_1.AuthController],
            exports: [auth_service_1.AuthService]
        })
    ], AuthModule);
    return AuthModule;
}());
exports.AuthModule = AuthModule;
