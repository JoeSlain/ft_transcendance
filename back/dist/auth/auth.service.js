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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const User_1 = require("../database/entities/User");
let AuthService = class AuthService {
    constructor(jwtService, userRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }
    createUser(details) {
        const user = {
            username: details.username,
            id42: details.id42,
            winratio: 'no games played',
            profile_pic: 'no avatar provided',
            elo: 0,
            n_win: 0,
            n_lose: 0,
            date_of_sign: new Date(),
        };
        return this.userRepository.create(user);
    }
    async validateUser(details) {
        console.log(details.id42);
        const user = await this.userRepository.findOneBy({ id42: details.id42 });
        console.log(user);
        if (user) {
            return user;
        }
        const newUser = this.createUser(details);
        console.log('user not found. Creating...');
        console.log('newUser', newUser);
        return this.userRepository.save(newUser);
    }
    async findUser(id) {
        const user = await this.userRepository.findOneBy({ id42: id });
        console.log('foundUser in db');
        console.log(user ? 'found' : 'not found');
        console.log('user');
        console.log(user);
        return user;
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(User_1.User)),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        typeorm_2.Repository])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map