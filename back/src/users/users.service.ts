import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/database';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private usersRepository: Repository<User>,) {}

    async setTwoFactorAuthenticationSecret(secret: string, userId: number) {
        return this.usersRepository.update(userId, {
            twoFactorAuthenticationSecret: secret
        });
    }

    async turnOnTwoFactorAuthentication(userId: number) {
        return this.usersRepository.update(userId, {
            isTwoFactorAuthenticationEnabled: true
        });
    }

    async turnOffTwoFactorAuthentication(userId: number) {
        return this.usersRepository.update(userId, {
            isTwoFactorAuthenticationEnabled: false
        });
    }

    async getById(userId: number) {
        const user = await this.usersRepository.findOneBy({ id: userId });

        console.log('getById');
        console.log(userId);
        console.log(user);
        return user;
    }
}
