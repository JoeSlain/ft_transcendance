import { Inject, Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';
import { parse } from 'cookie';
import { Notif } from 'src/database';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ChatService {
    constructor(
        private readonly authService: AuthService,
        @InjectRepository(Notif) private notifRepository: Repository<Notif>,
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

      async createNotif(data: any) {
        const notif = new Notif();

        notif.data = data;
        notif.user = data.to;
        return this.notifRepository.create(notif);
      }
}
