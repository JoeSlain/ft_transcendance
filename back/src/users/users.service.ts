import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Game, User } from "src/database";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Game) private gameRepo: Repository<Game>
  ) {}

  async setTwoFactorAuthenticationSecret(secret: string, userId: number) {
    return this.usersRepository.update(userId, {
      twoFactorAuthenticationSecret: secret,
    });
  }

  async turnOnTwoFactorAuthentication(userId: number) {
    return this.usersRepository.update(userId, {
      isTwoFactorAuthenticationEnabled: true,
    });
  }

  async turnOffTwoFactorAuthentication(userId: number) {
    return this.usersRepository.update(userId, {
      isTwoFactorAuthenticationEnabled: false,
    });
  }

  async getById(userId: number) {
    const user = await this.usersRepository.findOneBy({ id: userId });

    /*console.log('getById');
        console.log(userId);
        console.log(user);*/
    return user;
  }

  async getByUsername(userName: string) {
    if (!userName) return null;
    const user = await this.usersRepository.findOneBy({ username: userName });

    /*console.log('getByUsername');
        console.log(user);*/
    return user;
  }

  async addFriend(me: User, user: User): Promise<User | null> {
    console.log("addFriend");
    //console.log(user);
    if (user && user.id !== me.id) {
      try {
        await this.usersRepository
          .createQueryBuilder()
          .relation(User, "friends")
          .of(me)
          .add(user);
      } catch (error) {
        console.log(`friend ${user.username} already added`);
        return null;
      }
      console.log("friend added");
      return user;
    }
    console.log(`could'nt add user ${user.username}`);
    return null;
  }

  async getFriends(user: User): Promise<Array<User> | null> {
    const users = await this.usersRepository.query(
      ` SELECT * 
              FROM users U
              WHERE U.id <> $1
                AND EXISTS(
                  SELECT 1
                  FROM users_friends_users F
                  WHERE (F."usersId_1" = $1 AND F."usersId_2" = U.id )
                  OR (F."usersId_2" = $1 AND F."usersId_1" = U.id )
                  );  `,
      [user.id]
    );

    /*console.log('getFriends');
        console.log(users);*/
    return users;
  }

  async findFriend(userId: number, friendId: number) {
    const friend = await this.usersRepository.query(
      ` SELECT 1
                FROM users_friends_users
                WHERE ("usersId_1"=$1 AND "usersId_2"=$2)
                OR ("usersId_2"=$1 and "usersId_1"=$2);
            `,
      [userId, friendId]
    );

    return friend;
  }

  async deleteFriend(user: User, toDel: User) {
    await this.usersRepository
      .createQueryBuilder()
      .relation(User, "friends")
      .of(user)
      .remove(toDel);
    return this.getFriends(user);
  }

  async updateStatus(userId: number, newStatus: string) {
    /*await this.usersRepository.update(userId, {
            status: newStatus,
        })*/
    const modifiedUser = await this.getById(userId);
    return modifiedUser;
  }

  async updateUsername(userId: number, username: string) {
    console.log(
      "🚀 ~ file: users.service.ts:119 ~ UsersService ~ updateUsername ~ username",
      username
    );
    if (!username) return null;
    if (await this.getByUsername(username)) return null;
    await this.usersRepository.update(userId, {
      username: username,
    });
    return await this.getById(userId);
  }
  async updateUser(newUser: User): Promise<User> {
    console.log(
      "🚀 ~ file: users.service.ts:135 ~ UsersService ~ newUser.id",
      newUser
    );
    await this.usersRepository.update(newUser.id, newUser);
    return await this.getById(newUser.id);
    /*
    let user = await this.getById(id);
    user = newUser;
    return this.usersRepository.save(user); */
  }

  async uploadAvatar(userId: number, url: string) {
    await this.usersRepository.update(userId, {
      avatar: url,
    });
    return await this.getById(userId);
  }

  async block(myId: number, userId: number) {
    const me = await this.getById(myId);
    const user = await this.getById(userId);

    if (me && user) {
      if (me.blocked && me.blocked.includes(userId)) return;
      if (!me.blocked) me.blocked = [userId];
      else me.blocked.push(userId);
      return await this.usersRepository.save(me);
    }
    console.log("me", me);
    return me;
  }

  async checkBlocked(myId: number, userId: number) {
    const me = await this.getById(myId);

    if (me && me.blocked && me.blocked.includes(userId)) {
      console.log("blocked");
      return true;
    }
    return false;
  }

  async getGames(userId: number) {
    const games = await this.gameRepo.find({
      relations: {
        user1: true,
        user2: true,
      },
      where: [
        {
          user1: {
            id: userId,
          },
          user2: {
            id: userId,
          },
        },
      ],
    });

    return games;
  }
}
