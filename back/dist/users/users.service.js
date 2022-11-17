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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const database_1 = require("../database");
let UsersService = class UsersService {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async setTwoFactorAuthenticationSecret(secret, userId) {
        return this.usersRepository.update(userId, {
            twoFactorAuthenticationSecret: secret
        });
    }
    async turnOnTwoFactorAuthentication(userId) {
        return this.usersRepository.update(userId, {
            isTwoFactorAuthenticationEnabled: true
        });
    }
    async turnOffTwoFactorAuthentication(userId) {
        return this.usersRepository.update(userId, {
            isTwoFactorAuthenticationEnabled: false
        });
    }
    async getById(userId) {
        const user = await this.usersRepository.findOneBy({ id: userId });
        console.log('getById');
        console.log(userId);
        console.log(user);
        return user;
    }
    async getByUsername(userName) {
        const user = await this.usersRepository.findOneBy({ username: userName });
        console.log('getByUsername');
        console.log(user);
        return user;
    }
    async addFriend(me, userName) {
        const user = await this.getByUsername(userName);
        console.log('addFriend');
        console.log(user);
        if (user) {
            try {
                await this.usersRepository
                    .createQueryBuilder()
                    .relation(database_1.User, "friends")
                    .of(me)
                    .add(user);
            }
            catch (error) {
                console.log(`friend ${userName} already added`);
            }
        }
        return me;
    }
    async getFriends(user) {
        const users = await this.usersRepository.find({
            relations: {
                friends: true,
            },
        });
        console.log('getFriends');
        console.log(users);
        return users;
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(database_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map