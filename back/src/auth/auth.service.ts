import { Injectable } from '@nestjs/common';
import { UsersService, User } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService{
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) : Promise<string> {
    const payload = { username: user.username, sub: user.userId };
    
    return this.jwtService.sign(payload);
  }

  async findUser(username: string): Promise<User | undefined> {
    return this.usersService.findOne(username);
  }
}