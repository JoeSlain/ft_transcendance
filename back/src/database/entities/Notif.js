"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.Notif = void 0;
var typeorm_1 = require("typeorm");
var User_1 = require("./User");
var Channel_1 = require("./Channel");
var Notif = /** @class */ (function () {
    function Notif() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)()
    ], Notif.prototype, "id");
    __decorate([
        (0, typeorm_1.Column)()
    ], Notif.prototype, "type");
    __decorate([
        (0, typeorm_1.Column)()
    ], Notif.prototype, "acceptEvent");
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return User_1.User; })
    ], Notif.prototype, "from");
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return User_1.User; })
    ], Notif.prototype, "to");
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return Channel_1.Channel; })
    ], Notif.prototype, "channel");
    Notif = __decorate([
        (0, typeorm_1.Entity)({ name: "notif" })
    ], Notif);
    return Notif;
}());
exports.Notif = Notif;
