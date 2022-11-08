import { PassportSerializer } from "@nestjs/passport";
import { User } from "src/users/users.service";
import { Done } from "src/utils/types";
import { AuthService } from "../auth.service";


export class SessionSerializer extends PassportSerializer {
    constructor (private authService: AuthService,) {
        super();
    }

    serializeUser(user: User, done: Done) {
        done(null, user);
    }

    async deserializeUser(user: User, done: Done) {
        const userDb = await this.authService.findUser(user.username);
        return userDb ? done(null, userDb) : done(null, null);
    }
}