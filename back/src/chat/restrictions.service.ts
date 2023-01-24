import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Channel, Restriction, User } from "src/database";
import { Repository } from "typeorm";
import { ChannelService } from "./channel.service";

@Injectable()
export class RestrictionService {
  constructor(
    @InjectRepository(Restriction)
    private restrictionRepo: Repository<Restriction>,
    @InjectRepository(Channel) private chanRepo: Repository<Channel>,
    private readonly chanService: ChannelService
  ) {}

  async isMuted(userId: number, channel: Channel) {
    if (!channel.muted || !channel.muted.length) return false;
    const restriction = channel.muted.find(
      (restrict) => restrict.userId === userId
    );

    if (restriction) {
      if (restriction.end <= new Date()) {
        await this.restrictionRepo.remove(restriction);
        return false;
      }
      return true;
    }
    return false;
  }

  async isBanned(userId: number, channel: Channel) {
    if (!channel.banned || !channel.banned.length) return false;
    const restriction = channel.banned.find(
      (restrict) => restrict.userId === userId
    );

    if (restriction) {
      if (restriction.end <= new Date()) {
        await this.restrictionRepo.remove(restriction);
        return false;
      }
      return true;
    }
    return false;
  }

  async getMutedId(userId: number, channel: Channel) {
    if (!channel.muted || !channel.muted.length) return -1;
    const restriction = channel.muted.findIndex(
      (restrict) => restrict.userId === userId
    );
    return restriction;
  }

  async getBannedId(userId: number, channel: Channel) {
    if (!channel.banned || !channel.banned.length) return -1;
    const restriction = channel.banned.findIndex(
      (restrict) => restrict.userId === userId
    );
    return restriction;
  }

  async getMuted(userId: number, channel: Channel) {
    if (!channel.muted || !channel.muted.length) return null;
    const restriction = channel.muted.find(
      (restrict) => restrict.userId === userId
    );
    return restriction;
  }

  async getBanned(userId: number, channel: Channel) {
    if (!channel.banned || !channel.banned.length) return null;
    const restriction = channel.banned.find(
      (restrict) => restrict.userId === userId
    );
    return restriction;
  }

  async ban(user: User, channel: Channel, date: Date) {
    if (channel.owner.id === user.id) return null;
    const restrictionId = await this.getBannedId(user.id, channel);

    if (restrictionId >= 0) {
      channel.banned[restrictionId].end = date;
    } else {
      let restrict = this.restrictionRepo.create({
        userId: user.id,
        end: date,
      });
      restrict = await this.restrictionRepo.save(restrict);
      channel.banned.push(restrict);
    }
    return await this.chanRepo.save(channel);
  }

  async mute(user: User, channel: Channel, date: Date) {
    if (channel.owner.id === user.id) return null;
    const restrictionId = await this.getMutedId(user.id, channel);

    if (restrictionId >= 0) channel.muted[restrictionId].end = date;
    else {
      let restrict = this.restrictionRepo.create({
        userId: user.id,
        end: date,
      });
      restrict = await this.restrictionRepo.save(restrict);
      channel.muted.push(restrict);
    }
    channel = await this.chanRepo.save(channel);
    return channel;
  }
}
