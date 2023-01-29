import { Module } from "@nestjs/common";
import { GameGateway } from "./game.gateway";
import { GameService } from "./game.service";
import { RoomService } from "./room.service";
import { QueueService } from "./queue.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Game } from "src/database";

@Module({
  imports: [TypeOrmModule.forFeature([Game])],
  providers: [GameGateway, GameService, RoomService, QueueService],
})
export class GameModule {}
