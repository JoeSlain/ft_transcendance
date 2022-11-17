import { Repository } from 'typeorm';
import { User } from 'src/database';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    setTwoFactorAuthenticationSecret(secret: string, userId: number): Promise<import("typeorm").UpdateResult>;
    turnOnTwoFactorAuthentication(userId: number): Promise<import("typeorm").UpdateResult>;
    turnOffTwoFactorAuthentication(userId: number): Promise<import("typeorm").UpdateResult>;
    getById(userId: number): Promise<User>;
    getByUsername(userName: string): Promise<User | null>;
    addFriend(me: User, userName: string): Promise<User>;
    getFriends(user: User): Promise<User[]>;
}
