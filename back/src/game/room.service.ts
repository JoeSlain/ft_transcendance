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
        console.log('create room')
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
        console.log('join room')
        const room = this.findRoom(id);
        this.rooms.forEach((key, value) => {
            console.log(key + '=' + value);
        })
        if (!room)
            return 'ROOM NOT FOUND';
        if (room.guest)
            return 'ROOM FULL';
        console.log('joining room');
        room.guest = this.createRoomUser(user);
        this.rooms.set(user.id, room);
        this.rooms.set(id, room);
        return 'SUCCESS';
    }

    leaveRoom(id: number) {
        return this.rooms.delete(id);
    }
}
