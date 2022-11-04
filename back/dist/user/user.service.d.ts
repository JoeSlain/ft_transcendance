import { User } from './interfaces/user.interface';
export declare class UserService {
    private readonly users;
    create(user: User): void;
    findAll(): User[];
    findById(id: String): User;
    auth(user: User): User;
}
