"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionSerializer = void 0;
const passport_1 = require("@nestjs/passport");
class SessionSerializer extends passport_1.PassportSerializer {
    constructor(authService) {
        super();
        this.authService = authService;
    }
    serializeUser(user, done) {
        done(null, user);
    }
    async deserializeUser(user, done) {
        const userDb = await this.authService.findUser(user.username);
        return userDb ? done(null, userDb) : done(null, null);
    }
}
exports.SessionSerializer = SessionSerializer;
//# sourceMappingURL=Serializer.js.map