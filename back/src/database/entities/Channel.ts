import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToMany,
} from "typeorm";
import { User } from "./User";
import { ChanMessage } from "./ChanMessage";

@Entity({ name: "channels" })
export class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  socketId: string;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column({ nullable: true })
  password?: string;

  // relations
  @ManyToOne(() => User)
  owner: User;

  @ManyToMany(() => User)
  @JoinTable()
  users: User[];

  @ManyToMany(() => User)
  @JoinTable()
  admins: User[];

  @ManyToMany(() => User)
  @JoinTable()
  banned: User[];

  @ManyToMany(() => User)
  @JoinTable()
  muted: User[];

  @OneToMany(() => ChanMessage, (message) => message.channel)
  messages: ChanMessage[];
}
