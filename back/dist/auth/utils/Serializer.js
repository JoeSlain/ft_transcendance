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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionSerializer = void 0;
const passport_1 = require("@nestjs/passport");
const auth_service_1 = require("../auth.service");
const common_1 = require("@nestjs/common");
let SessionSerializer = class SessionSerializer extends passport_1.PassportSerializer {
    constructor(authService) {
        super();
        this.authService = authService;
    }
    serializeUser(user, done) {
        console.log('Serialize User');
        console.log('user');
        console.log(user);
        done(null, user);
    }
    async deserializeUser(payload, done) {
        const user = await this.authService.findUser(payload.id);
        console.log('payload');
        console.log(payload.id);
        console.log('Deserialize user');
        console.log(user);
        return user ? done(null, user) : done(null, null);
    }
};
SessionSerializer = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], SessionSerializer);
exports.SessionSerializer = SessionSerializer;
//# sourceMappingURL=Serializer.js.map