import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ChanMessage, Channel } from "src/database";
import { MessageData } from "src/utils/types";
import { Repository } from "typeorm";

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(ChanMessage) private msgRepo: Repository<ChanMessage>
  ) {}

  async findById(id: number) {
    const message = await this.msgRepo.find({
      where: {
        id,
      },
      relations: {
        from: true,
        channel: true,
      },
    });
    return message[0];
  }

  async createChanMessage(data: any) {
    console.log("create chan message, with data", data);
    let message = this.msgRepo.create({
      content: data.content,
      from: data.from,
      channel: data.channel,
    });
    message = await this.msgRepo.save(message);
    console.log("create message", message);
    return message;
  }
}