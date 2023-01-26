import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinTable,
  ManyToMany,
} from "typeorm";
import { User } from "./User";
import { DirectMessage } from "./DirectMessages";

@Entity({ name: "conversations" })
export class Conversation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  new1: boolean;

  @Column({ default: false })
  new2: boolean;

  // relations
  /*@ManyToMany((type) => User, (user) => user.conversations)
  @JoinTable()
  users: User[];*/

  @ManyToOne(() => User)
  user1: User;

  @ManyToOne(() => User)
  user2: User;

  @OneToMany(() => DirectMessage, (dm) => dm.conversation)
  messages: DirectMessage[];
}
