import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "src/auth/auth.module";
import { Channel, Notif } from "src/database";
import { GameModule } from "src/game/game.module";
import { RoomService } from "src/game/room.service";
import { NotifService } from "src/users/notifs.service";
import { UsersModule } from "src/users/users.module";
import { ChatGateway } from "./chat.gateway";
import { ChatService } from "./chat.service";
import { ChannelService } from "./channel.service";
import { ChatController } from "./chat.controller";

@Module({
  controllers: [ChatController],
  imports: [
    UsersModule,
    AuthModule,
    GameModule,
    TypeOrmModule.forFeature([Notif, Channel]),
  ],
  providers: [
    ChatGateway,
    ChatService,
    NotifService,
    RoomService,
    ChannelService,
  ],
})
export class ChatModule {}
