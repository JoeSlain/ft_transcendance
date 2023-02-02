"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.RoomService = void 0;
var common_1 = require("@nestjs/common");
var functions_1 = require("../utils/functions");
var RoomService = /** @class */ (function () {
    function RoomService() {
        this.rooms = new Map();
        this.usersRooms = new Map();
    }
    RoomService.prototype.createRoomUser = function (user) {
        return {
            infos: user,
            ready: false
        };
    };
    RoomService.prototype.createRoom = function (host) {
        console.log("create room");
        var id = (0, functions_1.generateRandomId)(10);
        while (this.findRoom(id))
            id = (0, functions_1.generateRandomId)(10);
        var room = {
            id: id,
            host: this.createRoomUser(host),
            guest: null,
            spectators: [],
            gameStarted: false
        };
        this.rooms.set(room.id, room);
        return room;
    };
    RoomService.prototype.isEmptyRoom = function (room) {
        return !room.host && !room.guest && !room.spectators.length;
    };
    RoomService.prototype.deleteRoom = function (roomId) {
        this.rooms["delete"](roomId);
        return null;
    };
    RoomService.prototype.addSpectator = function (user, room) {
        room.spectators.push(user);
        return room;
    };
    RoomService.prototype.findRoom = function (id) {
        return this.rooms.get(id);
    };
    RoomService.prototype.updateRoom = function (roomId, room) {
        var _this = this;
        this.rooms.set(roomId, room);
        this.usersRooms.set(room.host.infos.id, room);
        this.usersRooms.set(room.guest.infos.id, room);
        room.spectators.forEach(function (spectator) {
            _this.usersRooms.set(spectator.id, room);
        });
        return room;
    };
    RoomService.prototype.getUserRoom = function (id) {
        return this.usersRooms.get(id);
    };
    RoomService.prototype.setReady = function (roomId, userId) {
        var room = this.rooms.get(roomId);
        if (userId === room.host.infos.id) {
            room.host.ready = !room.host.ready;
            console.log("host ready");
        }
        else if (userId === room.guest.infos.id) {
            room.guest.ready = !room.guest.ready;
            console.log("guest ready");
        }
        this.rooms.set(room.id, room);
        return room;
    };
    RoomService.prototype.joinRoom = function (user, room) {
        console.log("join room");
        if (!room.guest)
            room.guest = this.createRoomUser(user);
        else
            room.spectators.push(user);
        this.rooms.set(room.id, room);
        return room;
    };
    RoomService.prototype.leaveRoom = function (id, userId) {
        var room = this.rooms.get(id);
        this.usersRooms["delete"](userId);
        if (room !== undefined) {
            if (room.host && room.host.infos.id === userId) {
                console.log("host left");
                room.host = room.guest;
                room.guest = null;
            }
            else if (room.guest && room.guest.infos.id === userId) {
                console.log("guest left");
                room.guest = null;
            }
            else {
                console.log("spectator left");
                room.spectators = room.spectators.filter(function (spectator) { return spectator.id !== userId; });
            }
            if (this.isEmptyRoom(room)) {
                console.log("room empty, deleting room");
                return this.deleteRoom(id);
            }
            this.rooms.set(room.id, room);
            return room;
        }
        return null;
    };
    RoomService = __decorate([
        (0, common_1.Injectable)()
    ], RoomService);
    return RoomService;
}());
exports.RoomService = RoomService;
