import { ConsoleLogger, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Channel, User } from "src/database";
import { ChannelData } from "src/utils/types";
import { Repository, createQueryBuilder } from "typeorm";

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel) private chanRepo: Repository<Channel>
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

  async getPublicChannels() {
    const chans = await this.chanRepo.find({
      where: [{ type: "public" }, { type: "protected" }],
    });
    return chans;
  }

  async getPrivateChannels(userId: number) {
    const chans = await this.chanRepo
      .createQueryBuilder("channel")
      .where("channel.type = :type", { type: "private" })
      .leftJoinAndSelect("channel.owner", "owner")
      .where("channel.owner = :id", { id: userId })
      .getMany();

    console.log("private chans", chans);
    return chans;
  }

  async getChannels(userId: number) {
    const publicChans = await this.getPublicChannels();
    const privateChans = await this.getPrivateChannels(userId);
    const ret = publicChans.concat(privateChans);

    console.log("concat chans", ret);
    return ret;
  }

  async createChannel(chanData: ChannelData) {
    if (await this.findChannel(chanData)) return null;

    const channel = this.chanRepo.create({
      name: chanData.name,
      type: chanData.type,
      password: chanData.password,
    });
    await this.chanRepo.save(channel);
    await this.chanRepo
      .createQueryBuilder()
      .relation(Channel, "owner")
      .of(channel)
      .set(chanData.owner);
    return channel;
  }
}
