import { Inject, Injectable } from "@nestjs/common";
import { AuthService } from "src/auth/auth.service";
import { Socket } from "socket.io";
import { WsException } from "@nestjs/websockets";
import { parse } from "cookie";
import { Notif, User } from "src/database";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { NotifData } from "src/utils/types";
import { from } from "rxjs";

@Injectable()
export class ChatService {
  constructor(private readonly authService: AuthService) {}

  users: Map<number, string> = new Map();
  statuses: Map<number, string> = new Map();

  addUser(id: number, socketId: string, status: string) {
    this.users.set(id, socketId);
    this.statuses.set(id, status);
  }

  removeUser(id: number) {
    this.statuses.delete(id);
    return this.users.delete(id);
  }

  getUser(id: number) {
    return this.users.get(id);
  }

  getUserStatus(id: number) {
    if (!this.statuses.has(id)) return "offline";
    return this.statuses.get(id);
  }

  updateUserStatus(id: number, status: string) {
    if (this.statuses.has(id)) this.statuses.set(id, status);
  }

  async getUserFromSocket(socket: Socket) {
    const cookie = socket.handshake.headers.cookie;
    console.log(cookie);
    const { Authentication: authenticationToken } = parse(cookie);
    console.log(authenticationToken);
    const user = await this.authService.getUserFromAuthenticationToken(
      authenticationToken
    );
    if (!user) {
      throw new WsException("Invalid credentials.");
    }
    return user;
  }
}
