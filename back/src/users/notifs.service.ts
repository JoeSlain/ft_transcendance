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
  ) {}

  async createNotif(data: NotifData) {
    const notifs = await this.findNotif(data);

    if (!notifs.length) {
      console.log("notif not found, creating new");
      const newNotif = this.notifRepository.create(data);
      console.log("newNotif", newNotif);
      return this.notifRepository.save(newNotif);
    }
    console.log("notif not created");
    return null;
  }

  async findChanInvite(data: NotifData) {
    return this.notifRepository.find({
      relations: {
        to: true,
        from: true,
        channel: true,
      },
      where: {
        to: {
          id: data.to.id,
        },
        from: {
          id: data.from.id,
        },
        channel: {
          id: data.channel.id,
        },
        type: data.type,
      },
    });
  }

  async findNotif(data: NotifData) {
    console.log("find one notif");

    if (data.channel) return this.findChanInvite(data);
    return this.notifRepository.find({
      relations: {
        to: true,
        from: true,
      },
      where: {
        to: {
          id: data.to.id,
        },
        from: {
          id: data.from.id,
        },
        type: data.type,
      },
    });
  }

  async getNotifs(userId: number) {
    console.log("getNotifs");
    return this.notifRepository.find({
      relations: {
        to: true,
        from: true,
        channel: true,
      },
      where: {
        to: {
          id: userId,
        },
      },
    });
  }

  async deleteNotif(data: NotifData) {
    const notif = await this.findNotif(data);

    console.log("deleting notif", notif);
    if (notif.length) await this.notifRepository.remove(notif[0]);
  }
}
