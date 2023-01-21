import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Channel } from "./Channel";

@Entity({ name: "restrictions" })
export class Restriction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  end: Date;

  @ManyToOne(() => Channel)
  banChannel: Channel;

  @ManyToOne(() => Channel)
  muteChannel: Channel;
}
