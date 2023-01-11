import { ConsoleLogger, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Channel, User } from "src/database";
import { ChannelData } from "src/utils/types";
import { Repository, createQueryBuilder } from "typeorm";
import * as bcrypt from "bcrypt";
import { NotifService } from "src/users/notifs.service";

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel) private chanRepo: Repository<Channel>,
    @InjectRepository(User) private userRepo: Repository<User>,
    private readonly notifService: NotifService
  ) {}

  async findChannel(chanData: ChannelData) {
    const channel = await this.chanRepo.find({
      where: {
        name: chanData.name,
        type: chanData.type,
      },
    });

    return channel[0];
  }

  async findChannelById(id: number) {
    const channel = await this.chanRepo.find({
      where: {
        id,
      },
      relations: {
        users: true,
        owner: true,
        banned: true,
        admins: true,
        muted: true,
        messages: {
          from: true,
        },
      },
    });
    //console.log("chanfound", channel);
    return channel[0];
  }

  async getChannelWithUsers(id: number) {
    const channel = await this.chanRepo.find({
      where: {
        id,
      },
      relations: {
        users: true,
        owner: true,
      },
    });
    channel[0].password = null;
    return channel[0];
  }

  async getPublicChannels() {
    const tmp = await this.chanRepo.find({
      where: [{ type: "public" }, { type: "protected" }],
      relations: {
        owner: true,
        users: true,
      },
    });
    const chans = tmp.map((chan) => {
      chan.password = null;
      return chan;
    });
    return chans;
  }

  async getPrivateChannels(userId: number) {
    /*const tmp = await this.chanRepo
      .createQueryBuilder("channel")
      .leftJoinAndSelect("channel.owner", "owner")
      .where("channel.owner = :id", { id: userId })
      .andWhere("channel.type = :type", { type: "private" })
      .getMany();*/

    const tmp = await this.chanRepo.find({
      relations: {
        users: true,
        owner: true,
      },
      where: {
        type: "private",
        users: {
          id: userId,
        },
      },
    });

    //console.log("tmpPrivateChans", tmp);
    const chans = tmp.map((chan) => {
      return { ...chan, password: null };
    });
    return chans;
  }

  async getChannels(userId: number) {
    const publicChans = await this.getPublicChannels();
    const privateChans = await this.getPrivateChannels(userId);
    const ret = publicChans.concat(privateChans);

    //console.log("concat chans", ret);
    return ret;
  }

  async checkChanData(chanData: ChannelData) {
    if (!chanData.name || (await this.findChannel(chanData)))
      return "invalid channel name";
    if (chanData.type === "protected" && !chanData.password)
      return "invalid password";
    return null;
  }

  async checkChanPassword(pass: string, cryptedPass: string) {
    return await bcrypt.compare(pass, cryptedPass);
  }

  async setChanPassword(channel: Channel, pass: string) {
    await this.chanRepo.update(channel.id, {
      password: await bcrypt.hash(pass, 10),
      type: "protected",
    });
    let chan = await this.getChannelWithUsers(channel.id);
    return chan;
  }

  async setChanOwner(user: User, channel: Channel) {
    channel.owner = user;
    return await this.chanRepo.save(channel);
    /*await this.chanRepo
      .createQueryBuilder()
      .relation(Channel, "owner")
      .of(channel)
      .set(user);
    return await this.addUserChan(user, channel, "admins");*/
  }

  async addUserChan(user: User, chan: Channel, role: string) {
    chan[role].push(user);
    return await this.chanRepo.save(chan);
    /*  await this.chanRepo
      .createQueryBuilder()
      .relation(Channel, role)
      .of(chan)
      .add(user);
    chan = await this.findChannelById(chan.id);
    return chan;*/
  }

  async createChannel(chanData: ChannelData) {
    let hashedPassword = null;
    if (chanData.type === "protected")
      hashedPassword = await bcrypt.hash(chanData.password, 10);
    let channel = this.chanRepo.create({
      name: chanData.name,
      type: chanData.type,
      socketId: `${chanData.type}/${chanData.name}`,
      password: hashedPassword,
    });
    await this.chanRepo.save(channel);
    channel = await this.findChannelById(channel.id);
    channel = await this.setChanOwner(chanData.owner, channel);
    channel = await this.addUserChan(chanData.owner, channel, "users");

    return channel;
  }

  findUserInChan(userId: number, channel: Channel) {
    if (!channel.users) return false;
    const found = channel.users.find((user) => user.id === userId);

    return found;
  }

  async removeUserChan(user: User, chan: Channel) {
    chan.admins = chan.admins.filter((u) => u.id !== user.id);
    chan.users = chan.users.filter((u) => u.id !== user.id);
    return this.chanRepo.save(chan);
  }

  async deleteChan(chan: Channel) {
    const notifs = await this.notifService.getChanNotifs(chan);

    notifs.forEach(async (notif) => {
      await this.notifService.deleteNotif(notif);
    });
    await this.chanRepo
      .createQueryBuilder()
      .relation(Channel, "messages")
      .of(chan)
      .remove(chan.messages);
    await this.chanRepo
      .createQueryBuilder("channels")
      .delete()
      .from(Channel)
      .where("id = :id", { id: chan.id })
      .execute();
  }

  async leaveChan(user: User, chan: Channel) {
    let channel = await this.findChannelById(chan.id);
    //console.log("chan1", chan);
    channel = await this.removeUserChan(user, channel);

    //console.log("chan2", chan);

    if (channel.owner.id === user.id) {
      if (channel.admins && channel.admins[0])
        channel = await this.setChanOwner(channel.admins[0], channel);
      else if (channel.users && channel.users[0])
        channel = await this.setChanOwner(channel.users[0], channel);
      else if (channel.type === "private") {
        await this.deleteChan(channel);
        return null;
      }
    }
    return channel;
  }
}
