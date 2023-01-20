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

  // relations
  @ManyToMany(() => User)
  @JoinTable()
  users: User[];

  @OneToMany(() => DirectMessage, (dm) => dm.conversation)
  messages: string[];
}
