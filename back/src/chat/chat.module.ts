import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Notif } from 'src/database';
import { GameModule } from 'src/game/game.module';
import { RoomService } from 'src/game/room.service';
import { NotifService } from 'src/users/notifs.service';
import { UsersModule } from 'src/users/users.module';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    GameModule,
    TypeOrmModule.forFeature([Notif]),
  ],
  providers: [ChatGateway, ChatService, NotifService, RoomService]
})
export class ChatModule {}
