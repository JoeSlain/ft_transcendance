import { Injectable, Inject } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";

// tmp
import { Strategy, Profile } from 'passport-google-oauth20';
import { AuthService } from "./auth.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {    
    constructor(
        @Inject('AUTH_SERVICE') private readonly authService: AuthService,
    ) {        
        super({
            clientID: process.env.FT_ID,
            clientSecret: process.env.FT_SECRET,
            callbackURL: process.env.FT_CALLBACK_URL,
            scope: ['profile', 'email'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile) {
        console.log('profile', profile);
        console.log('accessToken', accessToken);
        console.log('refreshToken', refreshToken);

        const user = await this.authService.validateUser(profile.displayName);
        console.log('validate');
        console.log(user);
        return user || null;
    }
}