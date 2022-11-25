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

        /*console.log('getById');
        console.log(userId);
        console.log(user);*/
        return user;
    }

    async getByUsername(userName: string): Promise<User | null> {
        const user = await this.usersRepository.findOneBy({ username: userName });

        /*console.log('getByUsername');
        console.log(user);*/
        return user;
    }

    async addFriend(me: User, userName: string) : Promise<User | null> {
        const user = await this.getByUsername(userName);

        console.log('addFriend');
        console.log(user);
        if (user && user.id !== me.id) {
            try {
                await this.usersRepository
                    .createQueryBuilder()
                    .relation(User, "friends")
                    .of(me)
                    .add(user);
            } catch (error) {
                console.log(`friend ${userName} already added`);
                return null;
            }
            console.log('friend added')
            return user;
        }
        console.log('userid', user.id)
        console.log('me.id', me.id)
        return null;
    }

    async getFriends(user: User) {
        const users = await this.usersRepository
        .query(
            ` SELECT * 
              FROM users U
              WHERE U.id <> $1
                AND EXISTS(
                  SELECT 1
                  FROM users_friends_users F
                  WHERE (F."usersId_1" = $1 AND F."usersId_2" = U.id )
                  OR (F."usersId_2" = $1 AND F."usersId_1" = U.id )
                  );  `,
            [user.id],
          )

        /*console.log('getFriends');
        console.log(users);*/
        return users;
    }

    async deleteFriend(user: User, toDelId: number) {
        const toDel = await this.getById(toDelId);

        if (toDel) {
            await this.usersRepository
                .createQueryBuilder()
                .relation(User, "friends")
                .of(user)
                .remove(toDel);
            return (this.getFriends(user));
        }
        return null;
    }

    async updateStatus(userId: number, newStatus: string, socketId: string) {
        await this.usersRepository.update(userId, {
            status: newStatus,
            socketId
        })

        console.log('update status', newStatus);
    }
}
