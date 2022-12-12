import { PassportSerializer } from "@nestjs/passport";
import { AuthService } from "../auth.service";
import { Inject, Injectable } from "@nestjs/common";
import { User } from "src/database/entities/User";

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly authService: AuthService) {
    super();
  }

  serializeUser(user: User, done: Function) {
    /*console.log('Serialize User');
        console.log('user');
        console.log(user);*/
    done(null, user);
  }

  async deserializeUser(payload: any, done: Function) {
    const user = await this.authService.findUser(payload.id);
    /*console.log('payload');
        console.log(payload.id);
        console.log('Deserialize user');
        console.log(user);*/

    return user ? done(null, user) : done(null, null);
  }
}
