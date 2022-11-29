import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Notif } from "src/database";
import { NotifData } from "src/utils/types";
import { Repository } from "typeorm";

@Injectable()
export class NotifService {
    constructor(
        @InjectRepository(Notif) private notifRepository: Repository<Notif>,
    ) { }


    async createNotif(data: NotifData) {
        if (data.header === 'Friend Request') {
            const notif = await this.findOne(data);

            if (notif === undefined) {
                console.log('no notif found, creating notif');
                return this.notifRepository.create(data);
            }
            console.log('notif already exists')
            console.log('notif found', notif)
            return null;
        }
    }

    async findOne(data: NotifData) {
        console.log('find one notif');
        if (data.header !== 'Friend Request')
            return null;
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
            },
            where: {
                to: {
                    id: userId,
                }
            }
        })
    }

    async deleteNotif(notif: Notif) {
        await this.notifRepository.remove(notif);
    }
}