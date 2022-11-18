"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModule = void 0;
const common_1 = require("@nestjs/common");
const users_controller_1 = require("./users.controller");
const users_service_1 = require("./users.service");
const typeorm_1 = require("@nestjs/typeorm");
const database_1 = require("../database");
const auth_module_1 = require("../auth/auth.module");
const auth_service_1 = require("../auth/auth.service");
const jwt_1 = require("@nestjs/jwt");
let UsersModule = class UsersModule {
};
UsersModule = __decorate([
    (0, common_1.Module)({
        controllers: [users_controller_1.UsersController],
        providers: [
            users_service_1.UsersService,
            auth_service_1.AuthService,
        ],
        imports: [
            typeorm_1.TypeOrmModule.forFeature([database_1.User]),
            auth_module_1.AuthModule,
            jwt_1.JwtModule.register({
                secret: process.env.FT_SECRET,
                signOptions: {
                    expiresIn: process.env.COOKIE_EXPIRATION_TIME,
                }
            }),
        ],
    })
], UsersModule);
exports.UsersModule = UsersModule;
//# sourceMappingURL=users.module.js.map