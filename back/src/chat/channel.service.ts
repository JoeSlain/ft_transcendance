import { ConsoleLogger, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ChanMessage, Channel, Restriction, User } from "src/database";
import { ChannelData } from "src/utils/types";
import { Brackets, Repository, createQueryBuilder } from "typeorm";
import * as bcrypt from "bcrypt";
import { NotifService } from "src/users/notifs.service";

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel) private chanRepo: Repository<Channel>,
    @InjectRepository(ChanMessage) private msgRepo: Repository<ChanMessage>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Restriction)
    private restrictionRepo: Repository<Restriction>,
    private readonly notifService: NotifService
  ) {}

  async findChannel(name: string, type: string) {
    const channel = await this.chanRepo.find({
      where: {
        name,
        type,
      },
    });

    return channel[0];
  }

  async findChannelById(id: number) {
    const channel = await this.chanRepo.findOne({
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
      order: {
        messages: {
          id: "ASC",
        },
      },
    });

    /* const messages = await this.msgRepo
      .createQueryBuilder("message")
      .leftJoinAndSelect("message.channel", "chan")
      .leftJoinAndSelect("message.from", "from")
      .where("chan.id = :id", { id })
      .orderBy("chan.id", "DESC")
      .take(10)
      .getMany();

    channel.messages = messages;*/
    //console.log("chanfound", channel);
    return channel;
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
        banned: true,
      },
    });
    const chans = tmp.map((chan) => {
      chan.password = null;
      return chan;
    });
    return chans;
  }

  async getPrivateChannels(userId: number) {
    const tmp = await this.chanRepo
      .createQueryBuilder("channels")
      .leftJoinAndSelect("channels.users", "user")
      .leftJoinAndSelect("channels.owner", "owner")
      .leftJoinAndSelect("channels.banned", "banned")
      .where("channels.type = :type", { type: "private" })
      .andWhere("user.id = :userId", { userId })
      /*new Brackets((qb) => {
          qb.where("banned.userId = :bannedId", { bannedId }).orWhere(
            "user.id = :userId",
            { userId }
          );
        })
      )*/
      .getMany();

    /*const tmp = await this.chanRepo.find({
      relations: {
        users: true,
        owner: true,
        banned: true,
      },
      where: [
        {
          type: "private",
          banned: {
            userId: userId,
          },
        },
      ],
    });*/

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
    if (!chanData.name) return "invalid channel name";
    if (chanData.type === "public" || chanData.type === "protected") {
      const chan =
        (await this.findChannel(chanData.name, "public")) ||
        (await this.findChannel(chanData.name, "protected"));
      if (chan) return "invalid channel name";
    } else if (await this.findChannel(chanData.name, "private"))
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
    let chan = await this.findChannelById(channel.id);
    return chan;
  }

  async removeChanPassword(channel: Channel) {
    channel.password = null;
    channel.type = "public";
    return await this.chanRepo.save(channel);
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

    //console.log("created channel", channel);
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

    chan.banned.forEach(async (ban) => {
      await this.restrictionRepo.remove(ban);
    });
    chan.muted.forEach(async (mute) => {
      await this.restrictionRepo.remove(mute);
    });
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

    channel = await this.removeUserChan(user, channel);
    if (channel.owner.id === user.id) {
      if (channel.admins && channel.admins[0])
        channel = await this.setChanOwner(channel.admins[0], channel);
      else if (channel.users && channel.users[0])
        channel = await this.setChanOwner(channel.users[0], channel);
      else if (channel.type === "private") {
        await this.deleteChan(channel);
        return null;
      } else channel = await this.setChanOwner(null, channel);
    }
    return channel;
  }
}
