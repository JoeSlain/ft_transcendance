import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "games" })
export class Game {
  @PrimaryGeneratedColumn()
  id: number;
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
