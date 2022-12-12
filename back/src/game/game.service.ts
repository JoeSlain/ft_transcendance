import { Injectable } from '@nestjs/common';
import { Room } from 'src/utils/types';
import { RoomService } from './room.service';

@Injectable()
export class GameService {
    constructor (
        private readonly roomService: RoomService,
    ) {}

    users: Map<number, string> = new Map();

    
}
