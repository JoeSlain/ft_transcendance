import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "./User";
import { Channel } from "./Channel";

@Entity({ name: "notif" })
export class Notif {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @ManyToOne(() => User)
  from: User;

  @ManyToOne(() => User)
  to: User;

  @ManyToOne(() => Channel)
  channel: Channel;
}
