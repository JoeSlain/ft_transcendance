import { PassportSerializer } from "@nestjs/passport";
import { AuthService } from "../auth.service";
import { User } from "src/database/entities/User";
export declare class SessionSerializer extends PassportSerializer {
    private readonly authService;
    constructor(authService: AuthService);
    serializeUser(user: User, done: Function): void;
    deserializeUser(payload: any, done: Function): Promise<any>;
}
