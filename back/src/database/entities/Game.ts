import {
  Entity,
  Column,
} from "typeorm";

@Entity({ name: "games" })
export class Game {
  @Column()
  userId1: number;
  @Column()
  userId2: number;
  @Column()
  winnerId: number;
  @Column()
  score: string;
  @Column()
  status: string;
  @Column()
  date: Date;
  @Column()
  gameId: number;
}
