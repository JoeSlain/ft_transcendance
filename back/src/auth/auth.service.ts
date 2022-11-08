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

  async validateUser(username: string) {
    const user = await this.userRepository.findOneBy({ username });

    console.log(user);
    if (user) {
      return user;
    }
    const newUser = this.userRepository.create({username});
    console.log('user not found. Creating...')
    console.log('newUser', newUser);
    return this.userRepository.save(newUser);
  }

  async findUser(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    return user;
  }
}