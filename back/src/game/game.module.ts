import { Module } from "@nestjs/common";
import { GameGateway } from "./game.gateway";
import { GameService } from "./game.service";
import { RoomService } from "./room.service";
import { QueueService } from "./queue.service";

@Module({
  providers: [GameGateway, GameService, RoomService, QueueService],
})
export class GameModule {}
