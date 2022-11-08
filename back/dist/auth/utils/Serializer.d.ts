import { PassportSerializer } from "@nestjs/passport";
import { User } from "src/users/users.service";
import { Done } from "src/utils/types";
import { AuthService } from "../auth.service";
export declare class SessionSerializer extends PassportSerializer {
    private authService;
    constructor(authService: AuthService);
    serializeUser(user: User, done: Done): void;
    deserializeUser(user: User, done: Done): Promise<void>;
}
