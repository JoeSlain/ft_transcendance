import { Injectable } from '@nestjs/common';
import { Room } from 'src/utils/types';

@Injectable()
export class GameService {
    rooms: Map<number, Room> = new Map();


}
