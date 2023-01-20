import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
  ManyToOne,
} from "typeorm";

import { Game } from "./Game";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  twoFactorAuthenticationSecret?: string;

  @Column({ default: false })
  isTwoFactorAuthenticationEnabled: boolean;

  @Column({ nullable: true })
  id42?: number;

  @Column()
  winratio: string;

  @Column()
  profile_pic: string;

  @Column({ nullable: true })
  avatar: string;

  @Column()
  elo: number;

  @Column()
  n_win: number;

  @Column()
  n_lose: number;

  @Column()
  date_of_sign: Date;

  @ManyToOne(() => User)
  games: Game[];

  // relations
  @ManyToMany((type) => User, (user) => user.friends)
  @JoinTable()
  friends: User[];

  /*    @OneToMany(() => Notif, (notif) => notif.from)
    received: Notif[]

    @OneToMany(() => Notif, (notif) => notif.to)
    sent: Notif[]*/
}
