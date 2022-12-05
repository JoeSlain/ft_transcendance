import { Injectable } from '@nestjs/common';
import { User } from 'src/database';
import { generateRandomId } from 'src/utils/functions';
import { Room, RoomUser } from 'src/utils/types';

@Injectable()
export class RoomService {
    rooms: Map<number, Room> = new Map();

    createRoomUser(user: User) : RoomUser{
        return {
            infos: user,
            ready: false,
        };
    }

    createRoom(user: User) {
        if (this.findRoom(user.id))
            return null;

        const newRoom = {
            host: { 
                infos: user,
                ready: false
            },
            guest: null,
            spectators: null,
        };

        this.rooms.set(user.id, newRoom);
        return newRoom;
    }

    findRoom(id: number) {
        return this.rooms.get(id);
    }

    joinRoom(id: number, user: User) {
        if (this.findRoom(user.id))
            return 'SUCCESS';

        const room = this.findRoom(id);
        if (!room)
            return 'ROOM NOT FOUND';
        if (room.guest)
            return 'ROOM FULL';
        room.guest = this.createRoomUser(user);
        return 'SUCCESS';
    }

    leaveRoom(id: number) {
        return this.rooms.delete(id);
    }
}
