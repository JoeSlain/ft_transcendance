import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "secrets" })
export class Secret {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  key: string;
}
