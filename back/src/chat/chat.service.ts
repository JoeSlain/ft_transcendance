import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';
import { parse } from 'cookie';

@Injectable()
export class ChatService {
    constructor(
        private readonly authService: AuthService,
      ) {}
     
      async getUserFromSocket(socket: Socket) {
        const cookie = socket.handshake.headers.cookie;
        console.log(cookie);
        const { Authentication: authenticationToken } = parse(cookie);
        console.log(authenticationToken)
        const user = await this.authService.getUserFromAuthenticationToken(authenticationToken);
        if (!user) {
          throw new WsException('Invalid credentials.');
        }
        return user;
      }
}
