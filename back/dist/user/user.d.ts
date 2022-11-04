import { User } from './interfaces/user.interface';
export declare class UserService {
    private readonly users;
    create(user: User): void;
    findAll(): User[];
    auth(user: User): boolean;
}
