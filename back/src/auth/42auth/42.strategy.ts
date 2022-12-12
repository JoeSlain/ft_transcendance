import { Injectable, Inject } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile } from "passport-42";
import { AuthService } from "../auth.service";

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.FT_ID,
      clientSecret: process.env.FT_SECRET,
      callbackURL: process.env.FT_CALLBACK_URL,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    /*console.log('profile', profile);
        console.log('accessToken', accessToken);
        console.log('refreshToken', refreshToken);
        console.log('id', profile.id);*/
    const details = {
      id42: profile.id,
      username: profile.username,
      email: profile._json.email,
      img_url: profile._json.image.link,
    };

    const user = await this.authService.validateUser(details);
    return user;
  }
}
