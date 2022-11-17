import { Repository } from 'typeorm';
import { User } from 'src/database/entities/User';
import { UserDetails } from 'src/utils/types';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private readonly userRepository;
    private readonly jwtService;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
    createUser(details: UserDetails): User;
    validateUser(details: UserDetails): Promise<User>;
    findUser(id: number): Promise<User>;
    getCookieWithJwtToken(userId: number): string;
    getCookieWithJwtAccessToken(userId: number, isSecondFactorAuthenticated?: boolean): string;
}
