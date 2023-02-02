"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.Conversation = void 0;
var typeorm_1 = require("typeorm");
var User_1 = require("./User");
var DirectMessages_1 = require("./DirectMessages");
var Conversation = /** @class */ (function () {
    function Conversation() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)()
    ], Conversation.prototype, "id");
    __decorate([
        (0, typeorm_1.Column)({ "default": false })
    ], Conversation.prototype, "new1");
    __decorate([
        (0, typeorm_1.Column)({ "default": false })
    ], Conversation.prototype, "new2");
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return User_1.User; })
    ], Conversation.prototype, "user1");
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return User_1.User; })
    ], Conversation.prototype, "user2");
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return DirectMessages_1.DirectMessage; }, function (dm) { return dm.conversation; })
    ], Conversation.prototype, "messages");
    Conversation = __decorate([
        (0, typeorm_1.Entity)({ name: "conversations" })
    ], Conversation);
    return Conversation;
}());
exports.Conversation = Conversation;
