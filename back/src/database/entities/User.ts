import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
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