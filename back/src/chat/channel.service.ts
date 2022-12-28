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
      },
    });
    return channel[0];
  }

  async getPublicChannels() {
    const chans = await this.chanRepo.find({
      where: [{ type: "public" }, { type: "protected" }],
    });
    return chans;
  }

  async getPrivateChannels(userId: number) {
    const tmp = await this.chanRepo
      .createQueryBuilder("channel")
      .leftJoinAndSelect("channel.owner", "owner")
      .where("channel.owner = :id", { id: userId })
      .andWhere("channel.type = :type", { type: "private" })
      .getMany();

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
      return "invalid password for protected channel";
    return null;
  }

  async createChannel(chanData: ChannelData) {
    let hashedPassword = null;
    if (chanData.type === "protected")
      hashedPassword = await bcrypt.hash(chanData.password, 10);
    const channel = this.chanRepo.create({
      name: chanData.name,
      type: chanData.type,
      password: hashedPassword,
    });
    await this.chanRepo.save(channel);
    await this.chanRepo
      .createQueryBuilder()
      .relation(Channel, "owner")
      .of(channel)
      .set(chanData.owner);

    return { ...channel, password: null };
  }

  findUserInChan(userId: number, channel: Channel) {
    const found = channel.users.find((user) => user.id === userId);

    console.log("users", channel.users);
    console.log("found", found);
    return found;
  }

  async addUserChan(user: User, chan: Channel) {
    if (!this.findUserInChan(user.id, chan)) {
      console.log(`adding user ${user.username} to chan ${chan.name}`);
      await this.chanRepo
        .createQueryBuilder()
        .relation(Channel, "users")
        .of(chan)
        .add(user);
    }
    return chan;
  }
}
