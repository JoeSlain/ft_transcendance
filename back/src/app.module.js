"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppModule = void 0;
var common_1 = require("@nestjs/common");
var app_controller_1 = require("./app.controller");
var app_service_1 = require("./app.service");
var auth_module_1 = require("./auth/auth.module");
var config_1 = require("@nestjs/config");
var Joi = require("joi");
var typeorm_1 = require("@nestjs/typeorm");
var database_1 = require("./database");
var passport_1 = require("@nestjs/passport");
var users_module_1 = require("./users/users.module");
var game_module_1 = require("./game/game.module");
var chat_module_1 = require("./chat/chat.module");
var dotenv = require("dotenv");
dotenv.config();
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        (0, common_1.Module)({
            imports: [
                config_1.ConfigModule.forRoot({
                    validationSchema: Joi.object({
                        FT_ID: Joi.string().required(),
                        FT_SECRET: Joi.string().required(),
                        FT_CALLBACK_URL: Joi.string().required()
                    })
                }),
                auth_module_1.AuthModule,
                passport_1.PassportModule.register({ session: true }),
                typeorm_1.TypeOrmModule.forRoot({
                    type: "postgres",
                    host: process.env.DB_HOST,
                    port: parseInt(process.env.DB_PORT),
                    username: process.env.DB_USER,
                    password: process.env.DB_PASS,
                    database: process.env.DB_NAME,
                    entities: database_1.entities,
                    synchronize: true
                }),
                users_module_1.UsersModule,
                game_module_1.GameModule,
                chat_module_1.ChatModule,
            ],
            controllers: [app_controller_1.AppController],
            providers: [app_service_1.AppService]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
