import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/database/entities/User';
import { UserDetails } from 'src/utils/types';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) { }

  createUser(details: UserDetails) {
    const user = {
      username: details.username,
      id42: details.id42,
      winratio: 'no games played',
      profile_pic: 'no avatar provided',
      elo: 0,
      n_win: 0,
      n_lose: 0,
      date_of_sign: new Date(),
    }

    return this.userRepository.create(user);
  }

  async validateUser(details: UserDetails) {
    console.log(details.id42);
    const user = await this.userRepository.findOneBy({ id42: details.id42 });

    console.log(user);
    if (user) {
      return user;
    }
    const newUser = this.createUser(details);
    console.log('user not found. Creating...')
    console.log('newUser', newUser);
    return this.userRepository.save(newUser);
  }

  async findUser(id: number) {
    const user = await this.userRepository.findOneBy({ id: id });
    console.log('foundUser in db');
    console.log(user ? 'found' : 'not found');
    console.log('user');
    console.log(user);

    return user;
  }
}