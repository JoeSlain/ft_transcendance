"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ChatModule = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var auth_module_1 = require("../auth/auth.module");
var database_1 = require("../database");
var game_module_1 = require("../game/game.module");
var room_service_1 = require("../game/room.service");
var notifs_service_1 = require("../users/notifs.service");
var users_module_1 = require("../users/users.module");
var chat_gateway_1 = require("./chat.gateway");
var chat_service_1 = require("./chat.service");
var channel_service_1 = require("./channel.service");
var chat_controller_1 = require("./chat.controller");
var message_service_1 = require("./message.service");
var restrictions_service_1 = require("./restrictions.service");
var game_service_1 = require("../game/game.service");
var ChatModule = /** @class */ (function () {
    function ChatModule() {
    }
    ChatModule = __decorate([
        (0, common_1.Module)({
            controllers: [chat_controller_1.ChatController],
            imports: [
                users_module_1.UsersModule,
                auth_module_1.AuthModule,
                game_module_1.GameModule,
                typeorm_1.TypeOrmModule.forFeature([
                    database_1.Notif,
                    database_1.Channel,
                    database_1.User,
                    database_1.ChanMessage,
                    database_1.Restriction,
                    database_1.DirectMessage,
                    database_1.Conversation,
                    database_1.Game,
                ]),
            ],
            providers: [
                chat_gateway_1.ChatGateway,
                chat_service_1.ChatService,
                notifs_service_1.NotifService,
                room_service_1.RoomService,
                channel_service_1.ChannelService,
                message_service_1.MessageService,
                restrictions_service_1.RestrictionService,
                game_service_1.GameService,
            ]
        })
    ], ChatModule);
    return ChatModule;
}());
exports.ChatModule = ChatModule;
