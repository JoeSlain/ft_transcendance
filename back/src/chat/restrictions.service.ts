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
    @InjectRepository(Restriction) private chanRepo: Repository<Restriction>,
    private readonly chanService: ChannelService
  ) {}

  async isMuted(userId: number, channel: Channel) {
    if (!channel.muted || channel.muted.length) return false;
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

  async getMuted(userId: number, channel: Channel) {
    if (!channel.muted || channel.muted.length) return null;
    const restriction = channel.muted.findIndex(
      (restrict) => restrict.userId === userId
    );
    return restriction;
  }

  async getBanned(userId: number, channel: Channel) {
    if (!channel.banned || !channel.banned.length) return null;
    const restriction = channel.banned.findIndex(
      (restrict) => restrict.userId === userId
    );
    return restriction;
  }

  async ban(user: User, channel: Channel, time: number) {
    if (channel.owner.id === user.id) return;
    const date = new Date(new Date().getTime() + time * 60000);
    const restrictionId = await this.getBanned(user.id, channel);

    if (restrictionId >= 0) {
      console.log("updating restriction", channel.banned[restrictionId]);
      channel.banned[restrictionId].end = date;
    } else {
      console.log("creating restriction");
      let restrict = this.restrictionRepo.create({
        userId: user.id,
        end: new Date(date.getTime() + time * 60000),
      });
      restrict = await this.restrictionRepo.save(restrict);
      channel.banned.push(restrict);
    }
    channel = await this.chanRepo.save(channel);
    return await this.chanService.removeUserChan(user, channel);
  }

  async mute(user: User, channel: Channel, time: number) {
    if (channel.owner.id === user.id) return;
    const date = new Date(new Date().getTime() + time * 60000);
    const restrictionId = await this.getMuted(user.id, channel);

    if (restrictionId >= 0) channel.muted[restrictionId].end = date;
    else {
      let restrict = this.restrictionRepo.create({
        userId: user.id,
        end: new Date(date.getTime() + time * 60000),
      });
      restrict = await this.restrictionRepo.save(restrict);
      channel.muted.push(restrict);
    }
    channel = await this.chanRepo.save(channel);
    return await this.chanService.removeUserChan(user, channel);
  }
}
