import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Notif } from './Notif';

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

    @Column({ nullable: true })
    id42?: number;

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

    @Column({ default: 'offline'})
    status: string;

    @Column({ nullable: true })
    socketId?: string;

    // relations
    @ManyToMany((type) => User, (user) => user.friends)
    @JoinTable()
    friends: User[]

/*    @OneToMany(() => Notif, (notif) => notif.from)
    received: Notif[]

    @OneToMany(() => Notif, (notif) => notif.to)
    sent: Notif[]*/
}