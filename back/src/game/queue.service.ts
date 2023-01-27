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
      (user) => userId !== user.id && user.elo <= maxElo
    );

    console.log("find opponent");
    if (index >= 0) {
      console.log(`removing opponent ${this.queue[index].username} from queue`);
      return this.queue.splice(index, index)[0];
    }
    return null;
  }

  checkQueued(index: number, userId: number) {
    console.log("queue", this.queue);
    console.log(`queue[${index}]`, this.queue[index]);
    console.log("user id", userId);

    return this.queue[index] && this.queue[index].id === userId;
  }

  stopQueue(userId: number, index?: number) {
    if (index === undefined) {
      console.log("index undefined");
      index = this.queue.findIndex((user) => user.id === userId);
      if (index >= 0) this.queue.splice(index, index);
    } else if (this.checkQueued(index, userId)) this.queue.splice(index, index);
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
