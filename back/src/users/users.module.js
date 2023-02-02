"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.UsersModule = void 0;
var common_1 = require("@nestjs/common");
var users_controller_1 = require("./users.controller");
var users_service_1 = require("./users.service");
var typeorm_1 = require("@nestjs/typeorm");
var database_1 = require("../database");
var auth_module_1 = require("../auth/auth.module");
var auth_service_1 = require("../auth/auth.service");
var jwt_1 = require("@nestjs/jwt");
var notifs_service_1 = require("./notifs.service");
var UsersModule = /** @class */ (function () {
    function UsersModule() {
    }
    UsersModule = __decorate([
        (0, common_1.Module)({
            controllers: [users_controller_1.UsersController],
            providers: [users_service_1.UsersService, auth_service_1.AuthService, notifs_service_1.NotifService],
            imports: [
                typeorm_1.TypeOrmModule.forFeature([database_1.User, database_1.Notif, database_1.Game, database_1.Secret]),
                auth_module_1.AuthModule,
                jwt_1.JwtModule.register({
                    secret: process.env.FT_SECRET,
                    signOptions: {
                        expiresIn: process.env.COOKIE_EXPIRATION_TIME
                    }
                }),
            ],
            exports: [users_service_1.UsersService, notifs_service_1.NotifService]
        })
    ], UsersModule);
    return UsersModule;
}());
exports.UsersModule = UsersModule;
