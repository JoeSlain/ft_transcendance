"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ChanMessage = void 0;
var typeorm_1 = require("typeorm");
var Channel_1 = require("./Channel");
var User_1 = require("./User");
var ChanMessage = /** @class */ (function () {
    function ChanMessage() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)()
    ], ChanMessage.prototype, "id");
    __decorate([
        (0, typeorm_1.Column)()
    ], ChanMessage.prototype, "content");
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return Channel_1.Channel; })
    ], ChanMessage.prototype, "channel");
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return User_1.User; })
    ], ChanMessage.prototype, "from");
    ChanMessage = __decorate([
        (0, typeorm_1.Entity)({ name: "chanMessages" })
    ], ChanMessage);
    return ChanMessage;
}());
exports.ChanMessage = ChanMessage;
