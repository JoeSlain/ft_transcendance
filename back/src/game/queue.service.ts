import { Injectable } from "@nestjs/common";
import { RoomService } from "./room.service";
import { User } from "src/database";

@Injectable()
export class QueueService {
  constructor(private readonly roomService: RoomService) {}

  queue: User[] = [];

  findOpponent(userId: number, elo: number, eloRange: number) {
    const maxElo = elo + eloRange;
    const index = this.queue.findIndex(
      (user) => userId !== user.id && user.elo >= elo && user.elo <= maxElo
    );

    console.log("find opponent");
    console.log(`user elo = ${elo}`);
    console.log(`max elo search = ${maxElo}`);
    if (index >= 0) {
      console.log(`opponent elo found = ${this.queue[index].elo}`);
      console.log(`removing opponent ${this.queue[index].username} from queue`);
      return this.queue.splice(index, 1)[0];
    }
    return null;
  }

  checkQueued(index: number, userId: number) {
    return this.queue[index] && this.queue[index].id === userId;
  }

  stopQueue(userId: number, index?: number) {
    if (index === undefined) {
      console.log("index undefined");
      index = this.queue.findIndex((user) => user.id === userId);
      if (index >= 0) {
        console.log("index found", index);
        this.queue.splice(index, 1);
      }
    } else if (this.checkQueued(index, userId)) this.queue.splice(index, 1);
  }

  queueUp(user: User) {
    return this.queue.push(user) - 1;
    /*let eloRange = 50;
    let opponent = this.findOpponent(user.id, user.elo, eloRange);

    if (opponent) {
      console.log(`opponent found ${opponent.username}`);
      return opponent;
    }
    console.log(`opponent not found, queueing user ${user.username}`);
    const index = this.queue.push(user) - 1;
    const interval = setInterval(() => {
      console.log("interval");
      eloRange += 50;
      if (!this.checkQueued(index, user.id)) {
        console.log(`user ${user.username} not queued`);
        clearInterval(interval);
        return null;
      }
      console.log(`user ${user.username} queued`);
      opponent = this.findOpponent(user.id, user.elo, eloRange);
      if (opponent) {
        console.log(`opponent found ${opponent.username}`);
        this.stopQueue(user.id, index);
        clearInterval(interval);
        return opponent;
      }
    }, 10000);
    console.log("out interval");*/
  }
}
