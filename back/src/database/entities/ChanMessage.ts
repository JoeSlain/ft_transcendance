import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Channel } from "./Channel";
import { User } from "./User";

@Entity({ name: "chanMessages" })
export class ChanMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  // relations
  @ManyToOne(() => Channel)
  channel: Channel;

  @ManyToOne(() => User)
  from: User;
}
