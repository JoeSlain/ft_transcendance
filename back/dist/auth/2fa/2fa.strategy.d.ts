import { Strategy } from "passport-jwt";
import { UsersService } from "src/users/users.service";
declare module "express" {
    interface Request {
        cookies: any;
    }
}
declare const TwoFactorStrategy_base: new (...args: any[]) => Strategy;
export declare class TwoFactorStrategy extends TwoFactorStrategy_base {
    private readonly usersService;
    constructor(usersService: UsersService);
    validate(payload: any): Promise<import("../../database").User>;
}
export {};
