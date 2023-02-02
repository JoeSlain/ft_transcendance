"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.User = void 0;
var typeorm_1 = require("typeorm");
var Secret_1 = require("./Secret");
var User = /** @class */ (function () {
    function User() {
    }
    User_1 = User;
    var User_1;
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)()
    ], User.prototype, "id");
    __decorate([
        (0, typeorm_1.Column)()
    ], User.prototype, "username");
    __decorate([
        (0, typeorm_1.Column)()
    ], User.prototype, "email");
    __decorate([
        (0, typeorm_1.Column)({ "default": false })
    ], User.prototype, "isTwoFactorAuthenticationEnabled");
    __decorate([
        (0, typeorm_1.Column)({ nullable: true })
    ], User.prototype, "id42");
    __decorate([
        (0, typeorm_1.Column)()
    ], User.prototype, "winratio");
    __decorate([
        (0, typeorm_1.Column)()
    ], User.prototype, "profile_pic");
    __decorate([
        (0, typeorm_1.Column)({ nullable: true })
    ], User.prototype, "avatar");
    __decorate([
        (0, typeorm_1.Column)()
    ], User.prototype, "elo");
    __decorate([
        (0, typeorm_1.Column)()
    ], User.prototype, "n_win");
    __decorate([
        (0, typeorm_1.Column)()
    ], User.prototype, "n_lose");
    __decorate([
        (0, typeorm_1.Column)()
    ], User.prototype, "date_of_sign");
    __decorate([
        (0, typeorm_1.Column)("int", { array: true, unique: true, nullable: true })
    ], User.prototype, "blocked");
    __decorate([
        (0, typeorm_1.ManyToMany)(function (type) { return User_1; }, function (user) { return user.friends; }),
        (0, typeorm_1.JoinTable)()
    ], User.prototype, "friends");
    __decorate([
        (0, typeorm_1.OneToOne)(function () { return Secret_1.Secret; }),
        (0, typeorm_1.JoinColumn)()
    ], User.prototype, "secret");
    User = User_1 = __decorate([
        (0, typeorm_1.Entity)({ name: "users" })
    ], User);
    return User;
}());
exports.User = User;
