import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Notif, User } from "src/database";
import { NotifData } from "src/utils/types";
import { Repository } from "typeorm";
import { UsersService } from "./users.service";

@Injectable()
export class NotifService {
    constructor(
        @InjectRepository(Notif) private notifRepository: Repository<Notif>,
        private readonly userService: UsersService
    ) { }


    async createNotif(data: NotifData) {
        const notifs = await this.findOne(data);

        if (notifs.length === 0) {
            console.log('notif not found, creating new')
            const newNotif = this.notifRepository.create(data);
            return this.notifRepository.save(newNotif);
        }
        console.log('notif not created')
        return null;
    }

    async findOne(data: NotifData) {
        console.log('find one notif');
        return this.notifRepository.find({
            relations: {
                to: true,
                from: true,
            },
            where: {
                to: {
                    id: data.to.id
                },
                from: {
                    id: data.from.id
                }
            }
        })
    }

    async getNotifs(userId: number) {
        console.log('getNotifs');
        return this.notifRepository.find({
            relations: {
                to: true,
                from: true,
            },
            where: {
                to: {
                    id: userId,
                }
            }
        })
    }

    async deleteNotif(data: NotifData) {
        const notif = await this.findOne(data);

        if (notif.length)
            await this.notifRepository.remove(notif);
    }
}