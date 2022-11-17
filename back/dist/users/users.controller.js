"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("../database");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const _2fa_guard_1 = require("../auth/2fa/2fa.guard");
const users_service_1 = require("./users.service");
class PostDTO {
}
let UsersController = class UsersController {
    constructor(userRepository, usersService) {
        this.userRepository = userRepository;
        this.usersService = usersService;
    }
    async findMe(req) {
        const user = await this.userRepository.findOneBy({ id: req.user.id });
        console.log('get profile', req.user.id);
        console.log(user);
        return user;
    }
    async findOneById(params) {
        const user = await this.userRepository.findOneBy({ id: params.id });
        console.log('get profile', params.id);
        console.log(user);
        return user;
    }
    async findOneByUsername(params) {
        const user = await this.userRepository.findOneBy({ username: params.username });
        console.log('find by username');
        console.log(user);
        return user;
    }
    async addFriend(req, { username }) {
        console.log(username);
        console.log('me', req.user.username);
        const user = this.usersService.addFriend(req.user, username);
        return (user);
    }
    async getFriends(req) {
        console.log('get friends');
        const users = await this.usersService.getFriends(req.user);
        return (users);
    }
};
__decorate([
    (0, common_1.Get)(''),
    (0, common_1.UseGuards)(_2fa_guard_1.TwoFactorGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findMe", null);
__decorate([
    (0, common_1.Get)('userid/:id'),
    (0, common_1.UseGuards)(_2fa_guard_1.TwoFactorGuard),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findOneById", null);
__decorate([
    (0, common_1.Get)('username/:username'),
    (0, common_1.UseGuards)(_2fa_guard_1.TwoFactorGuard),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findOneByUsername", null);
__decorate([
    (0, common_1.Post)('friend'),
    (0, common_1.UseGuards)(_2fa_guard_1.TwoFactorGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "addFriend", null);
__decorate([
    (0, common_1.Get)('friends'),
    (0, common_1.UseGuards)(_2fa_guard_1.TwoFactorGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getFriends", null);
UsersController = __decorate([
    (0, common_1.Controller)('users'),
    __param(0, (0, typeorm_2.InjectRepository)(database_1.User)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        users_service_1.UsersService])
], UsersController);
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map