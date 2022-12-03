import { Inject, Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';
import { parse } from 'cookie';
import { Notif, User } from 'src/database';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { NotifData } from 'src/utils/types';
import { from } from 'rxjs';

@Injectable()
export class ChatService {
  constructor(
    private readonly authService: AuthService,
  ) { }

  users: Map<number, string> = new Map();

  addUser(id: number, socketId: string) {
    this.users.set(id, socketId);
  }

  removeUser(id: number) {
    this.users.delete(id);
  }

  getUser(id: number) {
    return this.users.get(id);
  }

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
