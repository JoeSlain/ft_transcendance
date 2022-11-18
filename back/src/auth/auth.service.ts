import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/database/entities/User';
import { UserDetails } from 'src/utils/types';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  createUser(details: UserDetails) {
    const user = {
      username: details.username,
      id42: details.id42,
      email: details.email,
      winratio: 'no games played',
      profile_pic: details.img_url,
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

  // 42 cookie token
  getCookieWithJwtToken(userId: number) {
    const payload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: process.env.FT_SECRET,
      expiresIn: process.env.COOKIE_EXPIRATION_TIME,
    });

    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${process.env.COOKIE_EXPIRATION_TIME}`;
  }

  // 2fa cookie token
  getCookieWithJwtAccessToken(userId: number, isSecondFactorAuthenticated = false) {
    const payload = {
      userId, isSecondFactorAuthenticated
    };
    const token = this.jwtService.sign(payload, {
      secret: process.env.FT_SECRET,
      expiresIn: process.env.COOKIE_EXPIRATION_TIME,
    });

    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${process.env.COOKIE_EXPIRATION_TIME}`;
  }
}
