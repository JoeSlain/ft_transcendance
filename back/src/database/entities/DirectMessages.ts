import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "./User";
import { Conversation } from "./Conversation";

@Entity({ name: "directMessages" })
export class DirectMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  // relations
  @ManyToOne(() => User)
  from: User;

  @ManyToOne(() => Conversation)
  conversation: Conversation;
}
