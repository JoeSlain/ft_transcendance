import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "./User";
import { Message } from "./Message";

@Entity({ name: "channels" })
export class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column({ nullable: true })
  password?: string;

  // relations
  @ManyToOne(() => User)
  owner: User;

  @ManyToOne(() => User)
  users: User;

  @ManyToOne(() => User)
  admins: User;

  @ManyToOne(() => User)
  banned: User;

  @ManyToOne(() => User)
  muted: User;

  @ManyToOne(() => Message)
  messages: Message;
}
