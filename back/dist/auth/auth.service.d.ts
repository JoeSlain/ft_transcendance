import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from 'src/database/entities/User';
export declare class AuthService {
    private jwtService;
    private readonly userRepository;
    constructor(jwtService: JwtService, userRepository: Repository<User>);
    validateUser(username: string): Promise<User>;
    findUser(id: number): Promise<User>;
}
