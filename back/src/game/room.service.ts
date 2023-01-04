import { Injectable } from "@nestjs/common";
import { string } from "joi";
import { User } from "src/database";
import { generateRandomId } from "src/utils/functions";
import { Room, RoomUser } from "src/utils/types";
import { UpdateResult } from "typeorm";

@Injectable()
export class RoomService {
  rooms: Map<string, Room> = new Map();
  usersRooms: Map<number, Room> = new Map();

  createRoomUser(user: User): RoomUser {
    return {
      infos: user,
      ready: false,
    };
  }

  createRoom(roomId: number) {
    console.log("create room");
    const room = {
      id: roomId.toString(),
      guest: null,
      host: null,
      spectators: [],
      gameStarted: false,
    };
    this.rooms.set(room.id, room);
    return room;
  }

  isEmptyRoom(room: Room) {
    return !room.host && !room.guest;
  }

  deleteRoom(roomId: string) {
    this.rooms.delete(roomId);
    return null;
  }

  addSpectator(user: User, room: Room) {
    room.spectators.push(user);
    this.usersRooms.set(user.id, room);
    this.rooms.set(room.id, room);
  }

  findRoom(id: number) {
    return this.rooms.get(id.toString());
  }

  joinRoom(data: any) {
    console.log("join room");
    let room = this.findRoom(data.hostId);

    if (!room) room = this.createRoom(data.hostId);
    if (data.user.id === data.hostId)
      room.host = this.createRoomUser(data.user);
    else if (!room.guest) room.guest = this.createRoomUser(data.user);
    else return null;
    this.rooms.set(room.id, room);
    return room;
  }

  leaveRoom(id: string, userId: number) {
    let room = this.rooms.get(id);

    this.usersRooms.delete(userId);
    if (room !== undefined) {
      if (room.host && room.host.infos.id === userId) {
        console.log("host left");
        room.host = room.guest;
        room.guest = null;
        if (!room.host) {
          console.log("room empty, deleting room");
          return this.deleteRoom(id);
        }
        room.id = room.host.infos.id.toString();
      } else if (room.guest && room.guest.infos.id === userId) {
        console.log("guest left");
        room.guest = null;
      } else {
        console.log("spetator left");
        room.spectators = room.spectators.filter(
          (spectator) => spectator.id !== userId
        );
      }
      this.rooms.set(room.id, room);
      return room;
    }
    return null;
  }
}