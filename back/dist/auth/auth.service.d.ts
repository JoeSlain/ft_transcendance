import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from 'src/database/entities/User';
import { UserDetails } from 'src/utils/types';
export declare class AuthService {
    private jwtService;
    private readonly userRepository;
    constructor(jwtService: JwtService, userRepository: Repository<User>);
    createUser(details: UserDetails): User;
    validateUser(details: UserDetails): Promise<User>;
    findUser(id: number): Promise<User>;
}
