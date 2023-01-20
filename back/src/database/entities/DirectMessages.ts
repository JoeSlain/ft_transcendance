import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity({ name: "directMessages" })
export class DirectMessages {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  // relations
  @ManyToOne(() => User)
  to: User;

  @ManyToOne(() => User)
  from: User;
}
