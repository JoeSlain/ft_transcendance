import { Injectable } from "@nestjs/common";
import { User } from "src/database";

@Injectable()
export class QueueService {
  constructor() {}

  queue: User[] = [];
  intervals = new Map<number, number>();

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
  }

  addInterval(userId: number, intervalId: number) {
    this.intervals[userId].set(intervalId);
  }
}
