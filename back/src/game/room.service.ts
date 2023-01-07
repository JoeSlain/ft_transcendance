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

  createRoom(host: User) {
    console.log("create room");
    let id = generateRandomId(10);
    while (this.findRoom(id)) id = generateRandomId(10);
    const room = {
      id,
      host: this.createRoomUser(host),
      guest: null,
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
    return room;
  }

  findRoom(id: string) {
    return this.rooms.get(id);
  }

  getUserRoom(id: number) {
    return this.usersRooms.get(id);
  }

  joinRoom(user: User, room: Room) {
    console.log("join room");

    if (!room.guest) room.guest = this.createRoomUser(user);
    else room.spectators.push(user);
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
      } else if (room.guest && room.guest.infos.id === userId) {
        console.log("guest left");
        room.guest = null;
      } else {
        console.log("spectator left");
        room.spectators = room.spectators.filter(
          (spectator) => spectator.id !== userId
        );
      }
      this.rooms.set(room.id, room);
      return room;
    }
    return null;
  }

  // Méthode pour récupérer une salle à partir de son identifiant
  get(roomId: string): Room {
    return this.rooms.get(roomId);
  }
}
