"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.GameModule = void 0;
var common_1 = require("@nestjs/common");
var game_gateway_1 = require("./game.gateway");
var game_service_1 = require("./game.service");
var room_service_1 = require("./room.service");
var queue_service_1 = require("./queue.service");
var typeorm_1 = require("@nestjs/typeorm");
var database_1 = require("../database");
var GameModule = /** @class */ (function () {
    function GameModule() {
    }
    GameModule = __decorate([
        (0, common_1.Module)({
            imports: [typeorm_1.TypeOrmModule.forFeature([database_1.Game, database_1.User])],
            providers: [game_gateway_1.GameGateway, game_service_1.GameService, room_service_1.RoomService, queue_service_1.QueueService]
        })
    ], GameModule);
    return GameModule;
}());
exports.GameModule = GameModule;
