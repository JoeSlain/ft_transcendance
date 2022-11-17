import { User } from 'src/database';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly userRepository;
    private readonly usersService;
    constructor(userRepository: Repository<User>, usersService: UsersService);
    findMe(req: any): Promise<User>;
    findOneById(params: any): Promise<User>;
    findOneByUsername(params: any): Promise<User>;
    addFriend(req: any, { username }: {
        username: any;
    }): Promise<User>;
    getFriends(req: any): Promise<User[]>;
}
