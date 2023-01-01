import { ConsoleLogger, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Channel, User } from "src/database";
import { ChannelData } from "src/utils/types";
import { Repository, createQueryBuilder } from "typeorm";
import * as bcrypt from "bcrypt";

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel) private chanRepo: Repository<Channel>,
    @InjectRepository(User) private userRepo: Repository<User>
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
    console.log("chanfound", channel);
    return channel[0];
  }

  async getPublicChannels() {
    const chans = await this.chanRepo.find({
      where: [{ type: "public" }, { type: "protected" }],
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
        banned: true,
        admins: true,
        muted: true,
        messages: {
          from: true,
        },
      },
      where: {
        type: "private",
        users: {
          id: userId,
        },
      },
    });

    console.log("tmpPrivateChans", tmp);
    const chans = tmp.map((chan) => {
      return { ...chan, password: null };
    });
    return chans;
  }

  async getChannels(userId: number) {
    const publicChans = await this.getPublicChannels();
    const privateChans = await this.getPrivateChannels(userId);
    const ret = publicChans.concat(privateChans);

    console.log("concat chans", ret);
    return ret;
  }

  async checkChanData(chanData: ChannelData) {
    if (await this.findChannel(chanData)) return "invalid channel name";
    if (chanData.type === "protected" && !chanData.password)
      return "invalid password";
    return null;
  }

  async setChanOwner(user: User, channel: Channel) {
    await this.chanRepo
      .createQueryBuilder()
      .relation(Channel, "owner")
      .of(channel)
      .set(user);
    return await this.addUserChan(user, channel, "admins");
  }

  async addUserChan(user: User, chan: Channel, role: string) {
    await this.chanRepo
      .createQueryBuilder()
      .relation(Channel, role)
      .of(chan)
      .add(user);
    chan = await this.findChannelById(chan.id);
    return chan;
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
    channel = await this.chanRepo.save(channel);
    channel = await this.setChanOwner(chanData.owner, channel);
    channel = await this.addUserChan(chanData.owner, channel, "users");

    return { ...channel, password: null };
  }

  findUserInChan(userId: number, channel: Channel) {
    if (!channel.users) return false;
    const found = channel.users.find((user) => user.id === userId);

    return found;
  }

  async removeUserChan(user: User, chan: Channel) {
    if (chan.admins.find((u) => u.id === user.id)) {
      await this.chanRepo
        .createQueryBuilder()
        .relation(Channel, "admins")
        .of(chan)
        .remove(user);
    }
    if (chan.users.find((u) => u.id === user.id)) {
      await this.chanRepo
        .createQueryBuilder()
        .relation(Channel, "users")
        .of(chan)
        .remove(user);
    }
  }

  async deleteChan(chan: Channel) {
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
    console.log("chan1", chan);
    await this.removeUserChan(user, chan);
    chan = await this.findChannelById(chan.id);

    console.log("chan2", chan);

    if (chan.owner.id === user.id) {
      if (chan.admins && chan.admins[0])
        chan = await this.setChanOwner(chan.admins[0], chan);
      else if (chan.users && chan.users[0])
        chan = await this.setChanOwner(chan.users[0], chan);
      else {
        await this.deleteChan(chan);
        return null;
      }
    }
    return chan;
  }
}
