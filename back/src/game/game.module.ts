import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';
import { RoomService } from './room.service';

@Module({
  providers: [GameGateway, GameService, RoomService]
})
export class GameModule {}
