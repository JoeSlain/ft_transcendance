import { User } from "src/database";
import { UsersService } from "src/users/users.service";
export declare class TwoFactorAuthenticationService {
    private readonly usersService;
    constructor(usersService: UsersService);
    generateTwoFactorAuthenticationSecret(user: User): Promise<{
        secret: string;
        otpauthUrl: string;
    }>;
    pipeQrCodeStream(stream: any, otpauthUrl: string): Promise<void>;
    isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: string, user: User): boolean;
}
