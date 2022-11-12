import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    id42: number;

    @Column()
    winratio: string;

    @Column()
    profile_pic: string;

    @Column()
    elo: number;

    @Column()
    n_win: number;

    @Column()
    n_lose: number;

    @Column()
    date_of_sign: Date;
}