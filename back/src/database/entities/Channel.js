"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.Channel = void 0;
var typeorm_1 = require("typeorm");
var User_1 = require("./User");
var ChanMessage_1 = require("./ChanMessage");
var Restriction_1 = require("./Restriction");
var Channel = /** @class */ (function () {
    function Channel() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)()
    ], Channel.prototype, "id");
    __decorate([
        (0, typeorm_1.Column)()
    ], Channel.prototype, "socketId");
    __decorate([
        (0, typeorm_1.Column)()
    ], Channel.prototype, "name");
    __decorate([
        (0, typeorm_1.Column)()
    ], Channel.prototype, "type");
    __decorate([
        (0, typeorm_1.Column)({ nullable: true })
    ], Channel.prototype, "password");
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return User_1.User; })
    ], Channel.prototype, "owner");
    __decorate([
        (0, typeorm_1.ManyToMany)(function () { return User_1.User; }),
        (0, typeorm_1.JoinTable)()
    ], Channel.prototype, "users");
    __decorate([
        (0, typeorm_1.ManyToMany)(function () { return User_1.User; }),
        (0, typeorm_1.JoinTable)()
    ], Channel.prototype, "admins");
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return Restriction_1.Restriction; }, function (restriction) { return restriction.banChannel; })
    ], Channel.prototype, "banned");
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return Restriction_1.Restriction; }, function (restriction) { return restriction.muteChannel; })
    ], Channel.prototype, "muted");
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return ChanMessage_1.ChanMessage; }, function (message) { return message.channel; })
    ], Channel.prototype, "messages");
    Channel = __decorate([
        (0, typeorm_1.Entity)({ name: "channels" })
    ], Channel);
    return Channel;
}());
exports.Channel = Channel;
