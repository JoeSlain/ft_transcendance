import { TwoFactorAuthenticationService } from './2fa/2fa.service';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly twoFactorAuthenticationService;
    private readonly usersService;
    private readonly authService;
    constructor(twoFactorAuthenticationService: TwoFactorAuthenticationService, usersService: UsersService, authService: AuthService);
    login(): void;
    redirect(req: any, res: any): Promise<void>;
    register(res: any, req: any): Promise<void>;
    turnOnTwoFactorAuthentication(req: any, { twoFactorAuthenticationCode }: {
        twoFactorAuthenticationCode: any;
    }): Promise<void>;
    authenticate(req: any, { twoFactorAuthenticationCode }: {
        twoFactorAuthenticationCode: any;
    }): Promise<any>;
}
