import { Repository } from 'typeorm';
import { User } from 'src/database';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    setTwoFactorAuthenticationSecret(secret: string, userId: number): Promise<import("typeorm").UpdateResult>;
    turnOnTwoFactorAuthentication(userId: number): Promise<import("typeorm").UpdateResult>;
    turnOffTwoFactorAuthentication(userId: number): Promise<import("typeorm").UpdateResult>;
    getById(userId: number): Promise<User>;
}
