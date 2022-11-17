import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/database';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private usersRepository: Repository<User>,) { }

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

    async getByUsername(userName: string): Promise<User | null> {
        const user = await this.usersRepository.findOneBy({ username: userName });

        console.log('getByUsername');
        console.log(user);
        return user;
    }

    async addFriend(me: User, userName: string) {
        const user = await this.getByUsername(userName);

        console.log('addFriend');
        console.log(user);
        if (user) {
            try {
                await this.usersRepository
                    .createQueryBuilder()
                    .relation(User, "friends")
                    .of(me)
                    .add(user);
            } catch (error) {
                console.log(`friend ${userName} already added`);
            }
        } 
        return me;
    }

    async getFriends(user: User) {
        const users = await this.usersRepository.find({
            relations: {
                friends: true,
            },
        })

        console.log('getFriends');
        console.log(users);
        return users;
    }
}
