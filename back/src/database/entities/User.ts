import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  JoinColumn,
  OneToOne,
} from "typeorm";

import { Secret } from "./Secret";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  /*@Column({ nullable: true })
  twoFactorAuthenticationSecret?: string;*/

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

  @Column("int", { array: true, unique: true, nullable: true })
  blocked: number[];

  // relations
  @ManyToMany((type) => User, (user) => user.friends)
  @JoinTable()
  friends: User[];

  @OneToOne(() => Secret)
  @JoinColumn()
  secret: Secret;
}
