import { ExtractJwt, Strategy } from "passport-jwt";
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { UsersService } from "src/users/users.service";
import { Request } from 'express';

declare module "express" {
    export interface Request {
        cookies: any
    }
}

@Injectable()
export class TwoFactorStrategy extends PassportStrategy(
    Strategy,
    '2fa') {
    constructor(private readonly usersService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([(req: Request) => {
                return req?.cookies?.Authentication;
            }]),
            secretOrKey: process.env.FT_SECRET
        });
    }

    async validate(payload) {
        const user = await this.usersService.getById(payload.userId);
        
        if (!user.isTwoFactorAuthenticationEnabled) {
            return user;
        }
        if (payload.isSecondFactorAuthenticated) {
            return user;
        }
    }
}