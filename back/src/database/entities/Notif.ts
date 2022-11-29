import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity({ name: 'notif' })
export class Notif {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    header: string;

    @Column()
    body: string;

    @Column()
    accept: string;

    @Column()
    decline: string;

    @Column()
    acceptEvent: string;

    @Column({nullable: true})
    declineEvent: string;

    @ManyToOne(() => User, (user) => user.sent)
    from: User;

    @ManyToOne(() => User, (user) => user.received)
    to: User;
}