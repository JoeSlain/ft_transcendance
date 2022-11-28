import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './User';

type NotifData = {
    header: string,
    body: string, 
    accept: string,
    decline: string,
    from: User,
    to: User,
    acceptEvent: string,
    declineEvent: string,
}

@Entity({ name: 'notif' })
export class Notif {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    data: NotifData;

    @Column()
    status: string;

    @ManyToOne(() => User, (user) => user.notifs)
    user: User
}