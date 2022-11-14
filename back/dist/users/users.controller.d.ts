import { User } from 'src/database';
import { Repository } from 'typeorm';
export declare class UsersController {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    findOne(params: any): Promise<User>;
}
