import { Injectable } from '@nestjs/common';
import { string } from 'joi';
import { User } from 'src/database';
import { generateRandomId } from 'src/utils/functions';
import { Room, RoomUser } from 'src/utils/types';
import { UpdateResult } from 'typeorm';

@Injectable()
export class RoomService {
    rooms: Map<string, Room> = new Map();

    createRoomUser(user: User): RoomUser {
        return {
            infos: user,
            ready: false,
        };
    }

    createRoom(host: User, guest: User) {
        console.log('create room')
        const room = {
            id: host.id.toString(),
            host: {
                infos: host,
                ready: false
            },
            guest: {
                infos: guest,
                ready: false
            },
            spectators: [],
        };
        this.rooms.set(room.id, room);
        return room;
    }

    addSpectator(user: User, room: Room) {
        room.spectators.push(user);
        this.rooms.set(room.id, room);
    }

    findRoom(id: number) {
        return this.rooms.get(id.toString());
    }

    joinRoom(host: User, guest: User) {
        console.log('join room')
        let room = this.findRoom(host.id);
        if (room !== undefined)
            this.addSpectator(guest, room);
        else {
            /*this.rooms.forEach((value, key) => {
                console.log(key + '=' + value);
            })*/
            room = this.createRoom(host, guest);
        }
        return room;
    }

    leaveRoom(id: string, userId: number) {
        const room = this.rooms.get(id);

        if (room !== undefined) {
            console.log('room found, leaving room')
            if (room.host && room.host.infos.id === userId) {
                room.host = room.guest;
                room.guest = null;
            }
            else if (room.guest && room.guest.infos.id === userId)
                room.guest = null;
            else
                room.spectators.filter(spectator => spectator.id !== userId)
            this.rooms.set(room.id, room);
            return (room);
        }
        return null;
    }
}
