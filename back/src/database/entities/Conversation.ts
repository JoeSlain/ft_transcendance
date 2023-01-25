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
  newMessages: boolean;

  // relations
  @ManyToMany((type) => User, (user) => user.conversations)
  @JoinTable()
  users: User[];

  @OneToMany(() => DirectMessage, (dm) => dm.conversation)
  messages: DirectMessage[];
}