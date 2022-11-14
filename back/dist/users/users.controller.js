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
let UsersController = class UsersController {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async findOne(params) {
        const user = await this.userRepository.findOneBy({ id: params.id });
        return user;
    }
};
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(_2fa_guard_1.TwoFactorGuard),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findOne", null);
UsersController = __decorate([
    (0, common_1.Controller)('users'),
    __param(0, (0, typeorm_2.InjectRepository)(database_1.User)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], UsersController);
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map