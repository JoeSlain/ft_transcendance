import { Injectable } from "@nestjs/common";
import { User } from "src/database";
import { generateRandomId } from "src/utils/functions";
import { Room, RoomUser } from "src/utils/types";

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
    return !room.host && !room.guest && !room.spectators.length;
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

  updateRoom(roomId: string, room: Room) {
    this.rooms.set(roomId, room);
    this.usersRooms.set(room.host.infos.id, room);
    this.usersRooms.set(room.guest.infos.id, room);
    room.spectators.forEach((spectator) => {
      this.usersRooms.set(spectator.id, room);
    });
    return room;
  }

  getUserRoom(id: number) {
    return this.usersRooms.get(id);
  }

  setReady(roomId: string, userId: number) {
    const room = this.rooms.get(roomId);
    if (userId === room.host.infos.id) {
      room.host.ready = !room.host.ready;
      console.log("host ready");
    } else if (userId === room.guest.infos.id) {
      room.guest.ready = !room.guest.ready;
      console.log("guest ready");
    }
    this.rooms.set(room.id, room);
    return room;
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
      } else if (room.guest && room.guest.infos.id === userId) {
        console.log("guest left");
        room.guest = null;
      } else {
        console.log("spectator left");
        room.spectators = room.spectators.filter(
          (spectator) => spectator.id !== userId
        );
      }
      if (this.isEmptyRoom(room)) {
        console.log("room empty, deleting room");
        return this.deleteRoom(id);
      }
      this.rooms.set(room.id, room);
      return room;
    }
    return null;
  }
}
